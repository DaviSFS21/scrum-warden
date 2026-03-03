import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        email: string;
        id: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        active: boolean;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        id: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        active: boolean;
        createdAt: Date;
    }>;
    create(dto: CreateUserDto): Promise<{
        email: string;
        id: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        active: boolean;
    }>;
    deactivate(id: string): Promise<{
        id: string;
        name: string;
        active: boolean;
    }>;
    activate(id: string): Promise<{
        id: string;
        name: string;
        active: boolean;
    }>;
}
