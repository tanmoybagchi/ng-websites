import { IntegerRule } from './integer-rule';

export class MinIntegerRule extends IntegerRule {
  constructor(private minInteger: number, errorMessage: string) {
    super(errorMessage);
  }

  isBroken(propValue: number) {
    return !this.tryParseNumber(propValue) || this.parsedNumber < this.minInteger;
  }
}
