import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { CreateRuleDto } from './dto/create-rule.dto';

const DEFAULT_RULES = [
  { name: 'Daily Presencial', description: 'Falta na daily presencial', points: 3 },
  { name: 'Daily Escrita Omissão', description: 'Omissão na daily escrita', points: 3 },
  { name: 'Planning', description: 'Falta na Planning', points: 7 },
  { name: 'Review', description: 'Falta na Review', points: 5 },
  { name: 'Retrospectiva', description: 'Falta na Retrospectiva', points: 7 },
  { name: 'Falta de Progresso', description: 'Falta de progresso no Card', points: 2 },
  { name: 'Não Respondeu Marcação', description: 'Não responder marcação no chat', points: 2 },
  { name: 'Atraso Documentação', description: 'Atraso na entrega da documentação', points: 4 },
];

@Injectable()
export class RulesService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.rule.count();
    if (count === 0) {
      await this.prisma.rule.createMany({ data: DEFAULT_RULES });
    }
  }

  findAll() {
    return this.prisma.rule.findMany({ where: { active: true }, orderBy: { name: 'asc' } });
  }

  findOne(id: string) {
    return this.prisma.rule.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateRuleDto) {
    return this.prisma.rule.update({ where: { id }, data: dto });
  }

  create(dto: CreateRuleDto) {
    return this.prisma.rule.create({ data: dto });
  }

  deactivate(id: string) {
    return this.prisma.rule.update({ where: { id }, data: { active: false } });
  }
}
