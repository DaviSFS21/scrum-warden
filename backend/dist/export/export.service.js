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
exports.ExportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExportService = class ExportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateMarkdownForSprint(sprintId) {
        const activeSprint = sprintId
            ? await this.prisma.sprint.findUnique({ where: { id: sprintId } })
            : await this.prisma.sprint.findFirst({ where: { active: true } });
        if (!activeSprint) {
            return '# Scrum Warden Relatório\n\nNenhuma sprint ativa encontrada no momento.';
        }
        const users = await this.prisma.user.findMany({
            where: { active: true },
            select: { id: true, name: true, role: true },
            orderBy: { name: 'asc' },
        });
        const expulsions = await this.prisma.expulsion.findMany({
            select: { userId: true, reason: true },
        });
        const expelledMap = new Map(expulsions.map((e) => [e.userId, e.reason]));
        const sprintEntries = await this.prisma.pointEntry.findMany({
            where: { sprintId: activeSprint.id },
            include: {
                user: { select: { name: true } },
                rule: { select: { name: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
        let markdown = `# Relatório da Sprint: ${activeSprint.name}\n`;
        markdown += `Período: ${activeSprint.startDate.toLocaleDateString()} a ${activeSprint.endDate.toLocaleDateString()}\n\n`;
        markdown += `## 🏆 Placar Geral\n\n`;
        markdown += `| Integrante | Perfil | Pontos Sprint | Pontos Globais | Status |\n`;
        markdown += `|------------|--------|---------------|----------------|--------|\n`;
        for (const user of users) {
            if (user.role === 'SM')
                continue;
            const sprintPointsAgg = await this.prisma.pointEntry.aggregate({
                where: { userId: user.id, sprintId: activeSprint.id },
                _sum: { points: true },
            });
            const globalPointsAgg = await this.prisma.pointEntry.aggregate({
                where: { userId: user.id },
                _sum: { points: true },
            });
            const sp = sprintPointsAgg._sum.points ?? 0;
            const gp = globalPointsAgg._sum.points ?? 0;
            let status = '🟢 Regular';
            const expelledReason = expelledMap.get(user.id);
            if (expelledReason)
                status = `💀 EXPULSO (${expelledReason})`;
            else if (sp >= 10 || gp >= 17)
                status = '🔴 Crítico';
            else if (sp >= 5 || gp >= 10)
                status = '🟡 Risco Médio';
            markdown += `| **${user.name}** | ${user.role} | ${sp} pts | ${gp} pts | ${status} |\n`;
        }
        markdown += `\n---\n\n## 📝 Resumo de Infrações na Sprint\n\n`;
        if (sprintEntries.length === 0) {
            markdown += `*Nenhuma infração registrada nesta sprint. Excelente trabalho da equipe!*\n`;
        }
        else {
            sprintEntries.forEach((entry) => {
                const ruleName = entry.isGoldenRule ? '⚠️ Regra de Ouro Violada' : entry.rule?.name || 'Anotação Manual';
                const dateStr = entry.createdAt.toLocaleDateString();
                markdown += `- **${dateStr}** - ${entry.user.name}: ${ruleName} (+${entry.points} pts)`;
                if (entry.note)
                    markdown += ` *(Nota: ${entry.note})*`;
                markdown += `\n`;
            });
        }
        markdown += `\n\n*Gerado automaticamente pelo Scrum Warden MVP.*`;
        return markdown;
    }
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExportService);
//# sourceMappingURL=export.service.js.map