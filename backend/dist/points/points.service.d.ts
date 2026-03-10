import { PrismaService } from '../prisma/prisma.service';
import { AddPointDto } from './dto/add-point.dto';
export declare class PointsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId?: string, sprintId?: string): Promise<({
        user: {
            id: string;
            name: string;
        };
        sprint: {
            id: string;
            name: string;
        };
        rule: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        userId: string;
        sprintId: string;
        ruleId: string | null;
        points: number;
        note: string | null;
        isGoldenRule: boolean;
        createdAt: Date;
    })[]>;
    add(dto: AddPointDto): Promise<{
        user: {
            id: string;
            name: string;
        };
        sprint: {
            id: string;
            name: string;
        };
        rule: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        userId: string;
        sprintId: string;
        ruleId: string | null;
        points: number;
        note: string | null;
        isGoldenRule: boolean;
        createdAt: Date;
    }>;
    private checkAndExpel;
    private recalculateExpulsion;
    getExpulsions(): Promise<({
        user: {
            id: string;
            name: string;
        };
        sprint: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        sprintId: string;
        reason: string;
        expelledAt: Date;
    })[]>;
    remove(id: string): Promise<{
        id: string;
        userId: string;
        sprintId: string;
        ruleId: string | null;
        points: number;
        note: string | null;
        isGoldenRule: boolean;
        createdAt: Date;
    } | null>;
}
