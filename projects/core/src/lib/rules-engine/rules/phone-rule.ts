import { Rule } from './rule';

export class PhoneRule extends Rule {
  // https://developers.google.com/web/fundamentals/design-and-ui/input/forms/#use_these_attributes_to_validate_input
  // tslint:disable-next-line:max-line-length
  private readonly phoneRegExp = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;

  isBroken(propValue: any) {
    return !this.phoneRegExp.test(propValue);
  }
}
