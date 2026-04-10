import { IsString, IsObject } from 'class-validator';

export class SubmitPacerDto {
  @IsString()
  sprintId: string;

  @IsObject()
  evaluations: Record<string, { proactivity: number; autonomy: number; collaboration: number; delivery: number }>;
}
