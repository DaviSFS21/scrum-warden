import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { DailyService } from './daily.service';
import { RegisterDailyDto } from './dto/register-daily.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.SM)
@Controller('daily')
export class DailyController {
  constructor(private dailyService: DailyService) {}

  @Post()
  register(@Body() dto: RegisterDailyDto) {
    return this.dailyService.register(dto);
  }
}
