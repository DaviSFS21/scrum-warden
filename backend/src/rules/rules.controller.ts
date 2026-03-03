import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RulesService } from './rules.service';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { CreateRuleDto } from './dto/create-rule.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@UseGuards(AuthGuard('jwt'))
@Controller('rules')
export class RulesController {
  constructor(private rulesService: RulesService) {}

  @Get()
  findAll() {
    return this.rulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rulesService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SM)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRuleDto) {
    return this.rulesService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SM)
  @Post()
  create(@Body() dto: CreateRuleDto) {
    return this.rulesService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SM)
  @Delete(':id')
  deactivate(@Param('id') id: string) {
    return this.rulesService.deactivate(id);
  }
}
