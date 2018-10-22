import { Rule } from './rule';

export class NumberRule extends Rule {
  protected parsedNumber: number;

  isBroken(propValue: any) {
    return !this.tryParseNumber(propValue);
  }

  protected tryParseNumber(propValue: any) {
    this.parsedNumber = (typeof propValue === 'number')
      ? propValue
      : (typeof propValue === 'string')
        ? Number(propValue)
        : ('toString' in propValue)
          ? Number(propValue.toString())
          : NaN;

    if (isNaN(this.parsedNumber)) {
      this.parsedNumber = null;
      return false;
    }

    return true;
  }
}
