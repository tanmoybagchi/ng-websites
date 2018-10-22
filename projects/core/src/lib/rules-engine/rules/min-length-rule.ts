import { Rule } from './rule';

export class MinLengthRule extends Rule {
  constructor(private minLength: number, errorMessage: string) {
    super(errorMessage);
  }

  isBroken(propValue: string) {
    return propValue.length < this.minLength;
  }
}
