import { NumberRule } from './number-rule';

export class CurrencyRule extends NumberRule {
  private readonly CURRENCY_REGEXP = /^\$?[\d,]+\.?\d{0,2}$/;
  protected parsedNumber: number;

  isBroken(propValue: any) {
    return !this.tryParseNumber(propValue);
  }

  protected tryParseNumber(propValue: any) {
    if (!super.tryParseNumber(propValue)) {
      return false;
    }

    if (!this.CURRENCY_REGEXP.test(propValue)) {
      this.parsedNumber = null;
      return false;
    }

    return true;
  }
}
