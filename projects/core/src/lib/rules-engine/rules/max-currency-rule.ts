import { CurrencyRule } from './currency-rule';

export class MaxCurrencyRule extends CurrencyRule {
  constructor(private maxCurrency: number, errorMessage: string) {
    super(errorMessage);
  }

  isBroken(propValue: number) {
    return !this.tryParseNumber(propValue) || this.parsedNumber > this.maxCurrency;
  }
}
