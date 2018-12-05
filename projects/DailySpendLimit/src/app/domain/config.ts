export class Config {
  dailyLimit = 100;
  @Reflect.metadata('design:type', Date)
  effectiveFrom: Date = null;
  spreadsheetUrl = '';
  expenses = 0;

  currentLimit() {
    const from = this.effectiveFrom.valueOf();
    const today = new Date();
    const now = today.valueOf();

    if (from > now) {
      return 0;
    }

    let daysElapsed = 0;

    if (this.effectiveFrom.getFullYear() === today.getFullYear() && this.effectiveFrom.getMonth() === today.getMonth()) {
      daysElapsed = today.getDate() - this.effectiveFrom.getDate() + 1;
    } else {
      daysElapsed = today.getDate();
    }

    return (this.dailyLimit * daysElapsed) - Math.ceil(this.expenses);
  }
}
