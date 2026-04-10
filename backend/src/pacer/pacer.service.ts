import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitPacerDto } from './dto/submit-pacer.dto';

@Injectable()
export class PacerService {
  constructor(private prisma: PrismaService) {}

  async submit(evaluatorId: string, dto: SubmitPacerDto) {
    const { sprintId, evaluations } = dto;
    
    const sprint = await this.prisma.sprint.findUnique({ where: { id: sprintId } });
    if (!sprint) {
      throw new BadRequestException('Sprint not found');
    }
    if (!sprint.active) {
      throw new BadRequestException('Só é permitido votar no PACER da sprint atual.');
    }

    const evaluateeIds = Object.keys(evaluations);
    
    // Server-side manual validation since dynamic map fails with @ValidateNested implicitly
    for (const evaluateeId of evaluateeIds) {
      const scores = evaluations[evaluateeId];
      if (!scores) throw new BadRequestException('Avaliação incompleta ou inválida.');
      const fields = ['proactivity', 'autonomy', 'collaboration', 'delivery'] as const;
      for (const field of fields) {
        const val = scores[field];
        if (typeof val !== 'number' || val < 0 || val > 3 || !Number.isInteger(val)) {
          throw new BadRequestException(`Nota inválida para o usuário avaliado. Valores permitidos: 0 a 3.`);
        }
      }
    }

    return this.prisma.$transaction(async (prisma) => {
      for (const evaluateeId of evaluateeIds) {
        const scores = evaluations[evaluateeId];
        
        await prisma.pacerEvaluation.upsert({
          where: {
            sprintId_evaluatorId_evaluateeId: {
              sprintId,
              evaluatorId,
              evaluateeId,
            }
          },
          update: {
            proactivity: scores.proactivity,
            autonomy: scores.autonomy,
            collaboration: scores.collaboration,
            delivery: scores.delivery,
          },
          create: {
            sprintId,
            evaluatorId,
            evaluateeId,
            proactivity: scores.proactivity,
            autonomy: scores.autonomy,
            collaboration: scores.collaboration,
            delivery: scores.delivery,
          }
        });
      }
      return { success: true };
    });
  }

  async getSprintResults(sprintId: string) {
    const evaluations = await this.prisma.pacerEvaluation.findMany({
      where: { sprintId },
      include: {
        evaluatee: {
          select: { id: true, name: true, active: true },
        }
      }
    });

    const userStatsMap: Record<string, { 
      name: string;
      active: boolean;
      count: number;
      proactivitySum: number;
      autonomySum: number;
      collaborationSum: number;
      deliverySum: number;
    }> = {};

    for (const ev of evaluations) {
      if (!userStatsMap[ev.evaluateeId]) {
        userStatsMap[ev.evaluateeId] = {
          name: ev.evaluatee.name,
          active: ev.evaluatee.active,
          count: 0,
          proactivitySum: 0,
          autonomySum: 0,
          collaborationSum: 0,
          deliverySum: 0,
        };
      }
      
      const stats = userStatsMap[ev.evaluateeId];
      stats.count++;
      stats.proactivitySum += ev.proactivity;
      stats.autonomySum += ev.autonomy;
      stats.collaborationSum += ev.collaboration;
      stats.deliverySum += ev.delivery;
    }

    const results = Object.keys(userStatsMap).map(userId => {
      const stats = userStatsMap[userId];
      return {
        userId,
        name: stats.name,
        active: stats.active,
        evaluationsCount: stats.count,
        proactivity: Math.round(stats.proactivitySum / stats.count),
        autonomy: Math.round(stats.autonomySum / stats.count),
        collaboration: Math.round(stats.collaborationSum / stats.count),
        delivery: Math.round(stats.deliverySum / stats.count),
      };
    });

    return results.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getMyEvaluations(sprintId: string, evaluatorId: string) {
    const evaluations = await this.prisma.pacerEvaluation.findMany({
      where: { sprintId, evaluatorId },
    });
    
    const result: Record<string, any> = {};
    for (const ev of evaluations) {
      result[ev.evaluateeId] = {
        proactivity: ev.proactivity,
        autonomy: ev.autonomy,
        collaboration: ev.collaboration,
        delivery: ev.delivery,
      };
    }
    return result;
  }
}
