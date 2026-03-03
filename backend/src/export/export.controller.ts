import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ExportService } from './export.service';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('export')
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Get('markdown')
  async exportMarkdown(@Query('sprintId') sprintId: string, @Res() res: Response) {
    const markdown = await this.exportService.generateMarkdownForSprint(sprintId);
    
    // Set headers to trigger file download in browser
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="relatorio-scrum-warden.md"');
    
    res.send(markdown);
  }
}
