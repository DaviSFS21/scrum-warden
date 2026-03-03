import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AddPointDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  sprintId: string;

  @IsOptional()
  @IsString()
  ruleId?: string;

  @IsNumber()
  @Min(1)
  points: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsBoolean()
  isGoldenRule?: boolean;
}
