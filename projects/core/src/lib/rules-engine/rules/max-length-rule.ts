import { Rule } from './rule';

export class MaxLengthRule extends Rule {
  constructor(private maxLength: number, errorMessage: string) {
    super(errorMessage);
  }

  isBroken(propValue: string) {
    return propValue.length > this.maxLength;
  }
}
