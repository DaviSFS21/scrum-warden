export declare class DailyEntryDto {
    userId: string;
    ruleId: string;
    isGoldenRule?: boolean;
    note?: string;
}
export declare class RegisterDailyDto {
    sprintId: string;
    entries: DailyEntryDto[];
}
