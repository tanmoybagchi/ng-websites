import { IntegerRule } from './integer-rule';

export class MaxIntegerRule extends IntegerRule {
  constructor(private maxInteger: number, errorMessage: string) {
    super(errorMessage);
  }

  isBroken(propValue: number) {
    return !this.tryParseNumber(propValue) || this.parsedNumber > this.maxInteger;
  }
}
