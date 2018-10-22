export abstract class Rule {
  when: (x?: any) => boolean;
  // abstract isBroken(propertyValue: any, ruleValue?: any): boolean;
  abstract isBroken(propertyValue: any): boolean;

  constructor(public errorMessage: string) {
    if (String.isNullOrWhitespace(errorMessage)) {
      throw new Error('Must supply an error message');
    }
  }
}
