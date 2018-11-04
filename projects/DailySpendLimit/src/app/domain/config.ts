export class Config {
  dailyLimit = 100;
  @Reflect.metadata('design:type', Date)
  effectiveFrom: Date = null;
  spreadsheetUrl = '';
  expenses = 0;

  currentLimit() {
    const one_day = 1000 * 60 * 60 * 24;

    const from = this.effectiveFrom.valueOf();
    const now = Date.now();

    if (from > now) {
      return 0;
    }

    const daysElapsed = Math.ceil((now - from) / one_day);

    return (this.dailyLimit * daysElapsed) - this.expenses;
  }
}
