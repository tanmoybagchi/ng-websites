export class Config {
  dailyLimit = 0;
  @Reflect.metadata('design:type', Date)
  effectiveFrom: Date = null;
  expenses = 0;

  currentLimit() {
    const one_day = 1000 * 60 * 60 * 24;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysElapsed = Math.round((today.valueOf() - this.effectiveFrom.valueOf()) / one_day);

    return (this.dailyLimit * daysElapsed) - this.expenses;
  }
}
