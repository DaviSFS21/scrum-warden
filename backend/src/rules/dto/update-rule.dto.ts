import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UpdateRuleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  points: number;
}
