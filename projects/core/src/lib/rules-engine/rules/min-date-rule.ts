import { DateRule } from './date-rule';

export class MinDateRule extends DateRule {
  constructor(private minDate: Date, errorMessage: string) {
    super(errorMessage);
  }

  isBroken(propValue: any) {
    return this.tryParseDate(propValue) && this.parsedDate < this.minDate;
  }
}
