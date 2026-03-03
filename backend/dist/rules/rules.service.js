"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
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
let RulesService = class RulesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        const count = await this.prisma.rule.count();
        if (count === 0) {
            await this.prisma.rule.createMany({ data: DEFAULT_RULES });
        }
    }
    findAll() {
        return this.prisma.rule.findMany({ where: { active: true }, orderBy: { name: 'asc' } });
    }
    findOne(id) {
        return this.prisma.rule.findUnique({ where: { id } });
    }
    update(id, dto) {
        return this.prisma.rule.update({ where: { id }, data: dto });
    }
    create(dto) {
        return this.prisma.rule.create({ data: dto });
    }
    deactivate(id) {
        return this.prisma.rule.update({ where: { id }, data: { active: false } });
    }
};
exports.RulesService = RulesService;
exports.RulesService = RulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RulesService);
//# sourceMappingURL=rules.service.js.map