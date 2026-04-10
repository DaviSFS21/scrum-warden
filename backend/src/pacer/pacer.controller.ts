import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PacerService } from './pacer.service';
import { SubmitPacerDto } from './dto/submit-pacer.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('pacer')
export class PacerController {
  constructor(private readonly pacerService: PacerService) {}

  @Post()
  submit(@Request() req, @Body() dto: SubmitPacerDto) {
    return this.pacerService.submit(req.user.id, dto);
  }

  @Get('sprint/:sprintId')
  getSprintResults(@Param('sprintId') sprintId: string) {
    return this.pacerService.getSprintResults(sprintId);
  }

  @Get('sprint/:sprintId/my-evaluations')
  getMyEvaluations(@Request() req, @Param('sprintId') sprintId: string) {
    return this.pacerService.getMyEvaluations(sprintId, req.user.id);
  }
}
