export class Config {
  dailyLimit = 100;
  @Reflect.metadata('design:type', Date)
  effectiveFrom: Date = null;
  spreadsheetUrl: string;
  sheetId: number;
  expenses = 0;

  currentLimit() {
    const one_day = 1000 * 60 * 60 * 24;

    const today = new Date();

    const daysElapsed = Math.ceil((today.valueOf() - this.effectiveFrom.valueOf()) / one_day);

    return (this.dailyLimit * daysElapsed) - this.expenses;
  }
}
