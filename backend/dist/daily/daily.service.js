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
exports.DailyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const points_service_1 = require("../points/points.service");
let DailyService = class DailyService {
    prisma;
    pointsService;
    constructor(prisma, pointsService) {
        this.prisma = prisma;
        this.pointsService = pointsService;
    }
    async register(dto) {
        const results = [];
        for (const entry of dto.entries) {
            let points = 1;
            if (entry.ruleId) {
                const rule = await this.prisma.rule.findUnique({ where: { id: entry.ruleId } });
                if (rule)
                    points = rule.points;
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
};
exports.DailyService = DailyService;
exports.DailyService = DailyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        points_service_1.PointsService])
], DailyService);
//# sourceMappingURL=daily.service.js.map