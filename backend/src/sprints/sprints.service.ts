import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSprintDto } from './dto/create-sprint.dto';

@Injectable()
export class SprintsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.sprint.findMany({ orderBy: { startDate: 'desc' } });
  }

  findOne(id: string) {
    return this.prisma.sprint.findUnique({ where: { id } });
  }

  create(dto: CreateSprintDto) {
    return this.prisma.sprint.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
    });
  }

  async setActive(id: string) {
    // deactivate all, then activate selected
    await this.prisma.sprint.updateMany({ data: { active: false } });
    return this.prisma.sprint.update({ where: { id }, data: { active: true } });
  }

  update(id: string, dto: Partial<CreateSprintDto>) {
    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    return this.prisma.sprint.update({ where: { id }, data });
  }
}
