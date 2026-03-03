import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getSummary(sprintId?: string): Promise<{
        sprint: {
            id: string;
            name: string;
            active: boolean;
            createdAt: Date;
            startDate: Date;
            endDate: Date;
        } | null;
        members: {
            sprintPoints: number;
            globalPoints: number;
            riskLevel: "green" | "yellow" | "red";
            expelled: boolean;
            expulsionReason: string | undefined;
            email: string;
            id: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
        }[];
    }>;
}
