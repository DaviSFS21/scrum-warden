import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { PointsService } from './points.service';
import { AddPointDto } from './dto/add-point.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@UseGuards(AuthGuard('jwt'))
@Controller('points')
export class PointsController {
  constructor(private pointsService: PointsService) {}

  @Get()
  findAll(@Query('userId') userId?: string, @Query('sprintId') sprintId?: string) {
    return this.pointsService.findAll(userId, sprintId);
  }

  @Get('expulsions')
  getExpulsions() {
    return this.pointsService.getExpulsions();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SM)
  @Post()
  add(@Body() dto: AddPointDto) {
    return this.pointsService.add(dto);
  }
}
