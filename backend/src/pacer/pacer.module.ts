import { Module } from '@nestjs/common';
import { PacerService } from './pacer.service';
import { PacerController } from './pacer.controller';

@Module({
  controllers: [PacerController],
  providers: [PacerService],
})
export class PacerModule {}
