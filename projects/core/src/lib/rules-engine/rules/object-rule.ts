import { PropertyRule } from '../property-rule';
import { Rule } from './rule';

export class ObjectRule extends Rule {
  constructor(public rules: PropertyRule[]) {
    super('NA');
  }

  isBroken(propValue: any) {
    return false;
  }
}
