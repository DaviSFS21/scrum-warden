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
exports.SprintsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SprintsService = class SprintsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.sprint.findMany({ orderBy: { startDate: 'desc' } });
    }
    findOne(id) {
        return this.prisma.sprint.findUnique({ where: { id } });
    }
    create(dto) {
        return this.prisma.sprint.create({
            data: {
                ...dto,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
            },
        });
    }
    async setActive(id) {
        await this.prisma.sprint.updateMany({ data: { active: false } });
        return this.prisma.sprint.update({ where: { id }, data: { active: true } });
    }
    update(id, dto) {
        const data = { ...dto };
        if (dto.startDate)
            data.startDate = new Date(dto.startDate);
        if (dto.endDate)
            data.endDate = new Date(dto.endDate);
        return this.prisma.sprint.update({ where: { id }, data });
    }
    async remove(id) {
        await this.prisma.pointEntry.deleteMany({ where: { sprintId: id } });
        await this.prisma.expulsion.deleteMany({ where: { sprintId: id } });
        return this.prisma.sprint.delete({ where: { id } });
    }
};
exports.SprintsService = SprintsService;
exports.SprintsService = SprintsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SprintsService);
//# sourceMappingURL=sprints.service.js.map