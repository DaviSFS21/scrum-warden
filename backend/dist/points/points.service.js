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
exports.PointsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const SPRINT_LIMIT = 10;
const GLOBAL_LIMIT = 17;
let PointsService = class PointsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, sprintId) {
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
    async add(dto) {
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
        await this.checkAndExpel(dto.userId, dto.sprintId, dto.isGoldenRule ?? false);
        return entry;
    }
    async checkAndExpel(userId, sprintId, isGoldenRule) {
        const alreadyExpelled = await this.prisma.expulsion.findFirst({ where: { userId } });
        if (alreadyExpelled)
            return;
        if (isGoldenRule) {
            await this.prisma.expulsion.create({
                data: { userId, sprintId, reason: 'Regra de Ouro: Não entregou na sprint' },
            });
            return;
        }
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
};
exports.PointsService = PointsService;
exports.PointsService = PointsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PointsService);
//# sourceMappingURL=points.service.js.map