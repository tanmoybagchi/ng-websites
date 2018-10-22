import { DateRule } from './date-rule';

export class MaxDateRule extends DateRule {
  constructor(private maxDate: Date, errorMessage: string) {
    super(errorMessage);
  }

  isBroken(propValue: any) {
    return this.tryParseDate(propValue) && this.parsedDate > this.maxDate;
  }
}
