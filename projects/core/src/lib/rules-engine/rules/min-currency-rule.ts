import { CurrencyRule } from './currency-rule';

export class MinCurrencyRule extends CurrencyRule {
  constructor(private minCurrency: number, errorMessage: string) {
    super(errorMessage);
  }

  isBroken(propValue: number) {
    return !this.tryParseNumber(propValue) || this.parsedNumber < this.minCurrency;
  }
}
