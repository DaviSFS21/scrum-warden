import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { CreateRuleDto } from './dto/create-rule.dto';
export declare class RulesService implements OnModuleInit {
    private prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        active: boolean;
        description: string;
        points: number;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__RuleClient<{
        id: string;
        name: string;
        active: boolean;
        description: string;
        points: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateRuleDto): import("@prisma/client").Prisma.Prisma__RuleClient<{
        id: string;
        name: string;
        active: boolean;
        description: string;
        points: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(dto: CreateRuleDto): import("@prisma/client").Prisma.Prisma__RuleClient<{
        id: string;
        name: string;
        active: boolean;
        description: string;
        points: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    deactivate(id: string): import("@prisma/client").Prisma.Prisma__RuleClient<{
        id: string;
        name: string;
        active: boolean;
        description: string;
        points: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
