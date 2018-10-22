import { Rule } from './rule';

export class ChoiceRule extends Rule {
  constructor(private choices: string[], errorMessage: string) {
    super(errorMessage);
  }

  isBroken(propValue: any) {
    return this.choices.indexOf(propValue) === -1;
  }
}
