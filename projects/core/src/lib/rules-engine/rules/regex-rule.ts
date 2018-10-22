import { Rule } from './rule';

export class RegexRule extends Rule {
  constructor(private regex: RegExp, errorMessage: string) {
    super(errorMessage);
  }

  isBroken(propValue: any) {
    return !this.regex.test(propValue);
  }
}
