import { ExportService } from './export.service';
import type { Response } from 'express';
export declare class ExportController {
    private exportService;
    constructor(exportService: ExportService);
    exportMarkdown(sprintId: string, res: Response): Promise<void>;
}
