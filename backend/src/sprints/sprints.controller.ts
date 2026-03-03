import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@UseGuards(AuthGuard('jwt'))
@Controller('sprints')
export class SprintsController {
  constructor(private sprintsService: SprintsService) {}

  @Get()
  findAll() {
    return this.sprintsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sprintsService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SM)
  @Post()
  create(@Body() dto: CreateSprintDto) {
    return this.sprintsService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SM)
  @Patch(':id/activate')
  setActive(@Param('id') id: string) {
    return this.sprintsService.setActive(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SM)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateSprintDto>) {
    return this.sprintsService.update(id, dto);
  }
}
