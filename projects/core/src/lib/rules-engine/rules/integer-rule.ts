import { NumberRule } from './number-rule';

export class IntegerRule extends NumberRule {
  private readonly INTEGER_REGEXP = /^\-?\d+$/;
  protected parsedNumber: number;

  isBroken(propValue: any) {
    return !this.tryParseNumber(propValue);
  }

  protected tryParseNumber(propValue: any) {
    if (!super.tryParseNumber(propValue)) {
      return false;
    }

    if (!this.INTEGER_REGEXP.test(propValue)) {
      this.parsedNumber = null;
      return false;
    }

    return true;
  }
}
