import { isEmpty } from '../utils';
import { Rule } from './rule';

export class RequiredRule extends Rule {
  isBroken(propValue: any) {
    return isEmpty(propValue);
  }
}
