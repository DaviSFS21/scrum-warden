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
        createdAt: Date;
        points: number;
        userId: string;
        sprintId: string;
        ruleId: string | null;
        note: string | null;
        isGoldenRule: boolean;
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
        createdAt: Date;
        points: number;
        userId: string;
        sprintId: string;
        ruleId: string | null;
        note: string | null;
        isGoldenRule: boolean;
    }>;
    private checkAndExpel;
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
}
