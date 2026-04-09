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

  private async recalculateExpulsion(userId: string) {
    const expulsion = await this.prisma.expulsion.findFirst({ where: { userId } });
    if (!expulsion) return;

    const sprintId = expulsion.sprintId;

    const hasGolden = await this.prisma.pointEntry.findFirst({
      where: { userId, sprintId: expulsion.sprintId, isGoldenRule: true },
    });
    if (hasGolden) return;

    const sprintPoints = await this.prisma.pointEntry.aggregate({
      where: { userId, sprintId: expulsion.sprintId },
      _sum: { points: true },
    });
    if ((sprintPoints._sum.points ?? 0) >= SPRINT_LIMIT) return;

    const globalPoints = await this.prisma.pointEntry.aggregate({
      where: { userId },
      _sum: { points: true },
    });
    if ((globalPoints._sum.points ?? 0) >= GLOBAL_LIMIT) return;

    // No longer meets expulsion criteria
    await this.prisma.expulsion.delete({ where: { id: expulsion.id } });
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

  async update(id: string, points: number) {
    const entry = await this.prisma.pointEntry.update({
      where: { id },
      data: { points },
      include: {
        user: { select: { id: true, name: true } },
        rule: { select: { id: true, name: true } },
        sprint: { select: { id: true, name: true } },
      },
    });

    await this.recalculateExpulsion(entry.userId);
    await this.checkAndExpel(entry.userId, entry.sprintId, entry.isGoldenRule);

    return entry;
  }

  async remove(id: string) {
    const entry = await this.prisma.pointEntry.findUnique({ where: { id } });
    if (!entry) return null;

    const result = await this.prisma.pointEntry.delete({
      where: { id },
    });

    await this.recalculateExpulsion(entry.userId);

    return result;
  }
}
