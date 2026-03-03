import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddPointDto } from './dto/add-point.dto';

const SPRINT_LIMIT = 10;
const GLOBAL_LIMIT = 17;

@Injectable()
export class PointsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: string, sprintId?: string) {
    return this.prisma.pointEntry.findMany({
      where: {
        ...(userId && { userId }),
        ...(sprintId && { sprintId }),
      },
      include: {
        user: { select: { id: true, name: true } },
        sprint: { select: { id: true, name: true } },
        rule: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async add(dto: AddPointDto) {
    const entry = await this.prisma.pointEntry.create({
      data: {
        userId: dto.userId,
        sprintId: dto.sprintId,
        ...(dto.ruleId && { ruleId: dto.ruleId }),
        points: dto.points,
        note: dto.note,
        isGoldenRule: dto.isGoldenRule ?? false,
      },
      include: {
        user: { select: { id: true, name: true } },
        rule: { select: { id: true, name: true } },
        sprint: { select: { id: true, name: true } },
      },
    });

    // Check for expulsion
    await this.checkAndExpel(dto.userId, dto.sprintId, dto.isGoldenRule ?? false);

    return entry;
  }

  private async checkAndExpel(userId: string, sprintId: string, isGoldenRule: boolean) {
    const alreadyExpelled = await this.prisma.expulsion.findFirst({ where: { userId } });
    if (alreadyExpelled) return;

    // Golden Rule → immediate expulsion
    if (isGoldenRule) {
      await this.prisma.expulsion.create({
        data: { userId, sprintId, reason: 'Regra de Ouro: Não entregou na sprint' },
      });
      return;
    }

    // Sprint points limit
    const sprintPoints = await this.prisma.pointEntry.aggregate({
      where: { userId, sprintId },
      _sum: { points: true },
    });
    if ((sprintPoints._sum.points ?? 0) >= SPRINT_LIMIT) {
      await this.prisma.expulsion.create({
        data: { userId, sprintId, reason: `Atingiu ${SPRINT_LIMIT} pontos na sprint` },
      });
      return;
    }

    // Global points limit
    const globalPoints = await this.prisma.pointEntry.aggregate({
      where: { userId },
      _sum: { points: true },
    });
    if ((globalPoints._sum.points ?? 0) >= GLOBAL_LIMIT) {
      await this.prisma.expulsion.create({
        data: { userId, sprintId, reason: `Atingiu ${GLOBAL_LIMIT} pontos globais` },
      });
    }
  }

  async getExpulsions() {
    return this.prisma.expulsion.findMany({
      include: {
        user: { select: { id: true, name: true } },
        sprint: { select: { id: true, name: true } },
      },
      orderBy: { expelledAt: 'desc' },
    });
  }
}
