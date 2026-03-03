import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
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
