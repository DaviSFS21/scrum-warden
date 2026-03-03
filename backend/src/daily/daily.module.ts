import { Module } from '@nestjs/common';
import { DailyService } from './daily.service';
import { DailyController } from './daily.controller';
import { PointsModule } from '../points/points.module';

@Module({
  imports: [PointsModule],
  providers: [DailyService],
  controllers: [DailyController],
})
export class DailyModule {}
