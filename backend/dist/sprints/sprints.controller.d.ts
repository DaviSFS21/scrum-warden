import { SprintsService } from './sprints.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
export declare class SprintsController {
    private sprintsService;
    constructor(sprintsService: SprintsService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__SprintClient<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(dto: CreateSprintDto): import("@prisma/client").Prisma.Prisma__SprintClient<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    setActive(id: string): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
    }>;
    update(id: string, dto: Partial<CreateSprintDto>): import("@prisma/client").Prisma.Prisma__SprintClient<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
