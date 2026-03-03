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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSummary(sprintId) {
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
        const results = await Promise.all(users.map(async (user) => {
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
            let riskLevel = 'green';
            if (expelled || sprintPoints >= 10)
                riskLevel = 'red';
            else if (sprintPoints >= 5)
                riskLevel = 'yellow';
            return {
                ...user,
                sprintPoints,
                globalPoints,
                riskLevel,
                expelled: !!expelled,
                expulsionReason: expelled?.reason,
            };
        }));
        return { sprint: activeSprint, members: results };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map