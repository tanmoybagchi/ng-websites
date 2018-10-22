import { Result } from '../result';
import { PropertyRule } from './property-rule';
import { ObjectRule } from './rules/object-rule';
import { RequiredRule } from './rules/required-rule';
import { Rule } from './rules/rule';
import { isEmpty } from './utils';

export class RulesEngine {
  private entity: any;
  private result: Result;

  static create(propertyRules: PropertyRule[]) { return new RulesEngine(propertyRules); }

  constructor(private propertyRules: PropertyRule[]) { }

  check(instance: any) {
    this.result = new Result();

    try {
      this.entity = instance;

      this.propertyRules.forEach(propertyRule => this.checkProperty(propertyRule));
    } catch (e) {

    } finally {
      this.entity = null;
      return this.result;
    }
  }

  private checkProperty(propertyRule: PropertyRule) {
    let propValue = this.entity[propertyRule.propertyName];
    // tslint:disable-next-line:no-unused-expression
    typeof propValue === 'function' && (propValue = propValue());

    if (isEmpty(propValue)) {
      const requiredRule = this.getRequiredRule(propertyRule.rules);

      if (requiredRule !== null) {
        // tslint:disable-next-line:no-unused-expression
        this.isRuleBroken(requiredRule, propValue) && this.result.addError(requiredRule.errorMessage, propertyRule.propertyName);
      }

      return;
    }

    propertyRule.rules.forEach(rule => {
      if (!(rule instanceof ObjectRule)) {
        // tslint:disable-next-line:no-unused-expression
        this.isRuleBroken(rule, propValue) && this.result.addError(rule.errorMessage, propertyRule.propertyName);
        return;
      }

      const rle = RulesEngine.create(rule.rules);

      if (Array.isArray(propValue)) {
        this.result.errors[propertyRule.propertyName] = [];

        for (let index = 0; index < propValue.length; index++) {
          const item = propValue[index];

          const itemRuleCheck = rle.check(item);

          if (itemRuleCheck.hasErrors) {
            this.result.hasErrors = true;
            this.result.errors[propertyRule.propertyName][index] = itemRuleCheck.errors;
          }
        }

        return;
      }

      const tst = rle.check(propValue);
      if (tst.hasErrors) {
        this.result.hasErrors = true;
        this.result.errors[propertyRule.propertyName] = tst.errors;
      }
    });
  }

  private getRequiredRule(rules: Rule[]) {
    const r = rules.filter(rule => rule instanceof RequiredRule);

    return r.length === 1 ? r[0] : null;
  }

  private isRuleBroken(rule: Rule, propValue: any) {
    if (rule.when && !rule.when.call(null, this.entity)) {
      return false;
    }

    return rule.isBroken(propValue);
  }
}
