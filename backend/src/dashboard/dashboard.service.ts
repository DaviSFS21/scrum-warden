import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary(sprintId?: string) {
    const users = await this.prisma.user.findMany({
      where: { active: true },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: 'asc' },
    });

    const activeSprint = sprintId
      ? await this.prisma.sprint.findUnique({ where: { id: sprintId } })
      : await this.prisma.sprint.findFirst({ where: { active: true } });

    const expulsions = await this.prisma.expulsion.findMany({
      select: { userId: true, reason: true, expelledAt: true },
    });
    const expelledMap = new Map(expulsions.map((e) => [e.userId, e]));

    const results = await Promise.all(
      users.map(async (user) => {
        const sprintPointsAgg = activeSprint
          ? await this.prisma.pointEntry.aggregate({
              where: { userId: user.id, sprintId: activeSprint.id },
              _sum: { points: true },
            })
          : null;

        const globalPointsAgg = await this.prisma.pointEntry.aggregate({
          where: { userId: user.id },
          _sum: { points: true },
        });

        const sprintPoints = sprintPointsAgg?._sum?.points ?? 0;
        const globalPoints = globalPointsAgg._sum?.points ?? 0;

        const expelled = expelledMap.get(user.id);
        let riskLevel: 'green' | 'yellow' | 'red' = 'green';
        if (expelled || sprintPoints >= 10) riskLevel = 'red';
        else if (sprintPoints >= 5) riskLevel = 'yellow';

        return {
          ...user,
          sprintPoints,
          globalPoints,
          riskLevel,
          expelled: !!expelled,
          expulsionReason: expelled?.reason,
        };
      }),
    );

    return { sprint: activeSprint, members: results };
  }
}
