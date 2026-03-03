import { PrismaService } from '../prisma/prisma.service';
export declare class ExportService {
    private prisma;
    constructor(prisma: PrismaService);
    generateMarkdownForSprint(sprintId?: string): Promise<string>;
}
