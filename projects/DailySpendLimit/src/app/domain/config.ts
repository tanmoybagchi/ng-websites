export class Config {
  dailyLimit = 100;
  @Reflect.metadata('design:type', Date)
  effectiveFrom: Date = null;
  spreadsheetUrl: string;
  sheetId: number;
}
