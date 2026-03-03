import { IsArray, IsNotEmpty, IsString, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class DailyEntryDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  ruleId: string;

  @IsOptional()
  @IsBoolean()
  isGoldenRule?: boolean;

  @IsOptional()
  @IsString()
  note?: string;
}

export class RegisterDailyDto {
  @IsNotEmpty()
  @IsString()
  sprintId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DailyEntryDto)
  entries: DailyEntryDto[];
}
