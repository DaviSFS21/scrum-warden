import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDailyDto } from './dto/register-daily.dto';
import { PointsService } from '../points/points.service';

@Injectable()
export class DailyService {
  constructor(
    private prisma: PrismaService,
    private pointsService: PointsService,
  ) {}

  async register(dto: RegisterDailyDto) {
    const results: any[] = [];
    for (const entry of dto.entries) {
      let points = 1;
      if (entry.ruleId) {
        const rule = await this.prisma.rule.findUnique({ where: { id: entry.ruleId } });
        if (rule) points = rule.points;
      }
      const result = await this.pointsService.add({
        userId: entry.userId,
        sprintId: dto.sprintId,
        ruleId: entry.ruleId,
        points,
        note: entry.note,
        isGoldenRule: entry.isGoldenRule ?? false,
      });
      results.push(result);
    }
    return results;
  }
}
