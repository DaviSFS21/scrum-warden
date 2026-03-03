import { DailyService } from './daily.service';
import { RegisterDailyDto } from './dto/register-daily.dto';
export declare class DailyController {
    private dailyService;
    constructor(dailyService: DailyService);
    register(dto: RegisterDailyDto): Promise<any[]>;
}
