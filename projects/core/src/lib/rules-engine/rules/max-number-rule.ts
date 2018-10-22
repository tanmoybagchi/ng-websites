import { NumberRule } from './number-rule';

export class MaxNumberRule extends NumberRule {
  constructor(private maxNumber: number, errorMessage: string) {
    super(errorMessage);
  }

  isBroken(propValue: any) {
    return !this.tryParseNumber(propValue) || this.parsedNumber > this.maxNumber;
  }
}
