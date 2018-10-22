import { NumberRule } from './number-rule';

export class MinNumberRule extends NumberRule {
  constructor(private minNumber: number, errorMessage: string) {
    super(errorMessage);
  }

  isBroken(propValue: number) {
    return !this.tryParseNumber(propValue) || this.parsedNumber < this.minNumber;
  }
}
