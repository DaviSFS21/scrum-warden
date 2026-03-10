import { PointsService } from './points.service';
import { AddPointDto } from './dto/add-point.dto';
export declare class PointsController {
    private pointsService;
    constructor(pointsService: PointsService);
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
