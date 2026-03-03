import { PrismaService } from '../prisma/prisma.service';
import { RegisterDailyDto } from './dto/register-daily.dto';
import { PointsService } from '../points/points.service';
export declare class DailyService {
    private prisma;
    private pointsService;
    constructor(prisma: PrismaService, pointsService: PointsService);
    register(dto: RegisterDailyDto): Promise<any[]>;
}
