import { PropertyRule } from './property-rule';
import { ChoiceRule } from './rules/choice-rule';
import { CurrencyRule } from './rules/currency-rule';
import { DateRule } from './rules/date-rule';
import { EmailRule } from './rules/email-rule';
import { IntegerRule } from './rules/integer-rule';
import { MaxCurrencyRule } from './rules/max-currency-rule';
import { MaxDateRule } from './rules/max-date-rule';
import { MaxIntegerRule } from './rules/max-integer-rule';
import { MaxLengthRule } from './rules/max-length-rule';
import { MaxNumberRule } from './rules/max-number-rule';
import { MinCurrencyRule } from './rules/min-currency-rule';
import { MinDateRule } from './rules/min-date-rule';
import { MinIntegerRule } from './rules/min-integer-rule';
import { MinLengthRule } from './rules/min-length-rule';
import { MinNumberRule } from './rules/min-number-rule';
import { NumberRule } from './rules/number-rule';
import { ObjectRule } from './rules/object-rule';
import { PhoneRule } from './rules/phone-rule';
import { RegexRule } from './rules/regex-rule';
import { RequiredRule } from './rules/required-rule';
import { getMemberNameFromSelector } from './utils';

/**
 * Use the start method.
 */
export class RuleBuilder<TClass> {
  private classRules: PropertyRule[] = [];
  private propertyRules: PropertyRule;

  /**
   * Start building rules.
   */
  static for<TClass>() {
    return new RuleBuilder<TClass>();
  }

  property(propertySelector: (instance: TClass) => any) {
    this.propertyRules = new PropertyRule();
    this.propertyRules.propertyName = getMemberNameFromSelector(propertySelector);

    this.classRules.push(this.propertyRules);

    return this;
  }

  build() {
    return this.classRules;
  }

  choice(choices: string[], errorMessage: string) {
    this.propertyRules.rules.push(new ChoiceRule(choices, errorMessage));
    return this;
  }

  currency(errorMessage: string) {
    this.propertyRules.rules.push(new CurrencyRule(errorMessage));
    return this;
  }

  date(errorMessage: string) {
    this.propertyRules.rules.push(new DateRule(errorMessage));
    return this;
  }

  email(errorMessage: string) {
    this.propertyRules.rules.push(new EmailRule(errorMessage));
    return this;
  }

  integer(errorMessage: string) {
    this.propertyRules.rules.push(new IntegerRule(errorMessage));
    return this;
  }

  maxCurrency(maxCurrency: number, errorMessage: string) {
    this.propertyRules.rules.push(new MaxCurrencyRule(maxCurrency, errorMessage));
    return this;
  }

  maxDate(maxDate: Date, errorMessage: string) {
    this.propertyRules.rules.push(new MaxDateRule(maxDate, errorMessage));
    return this;
  }

  maxInteger(maxInteger: number, errorMessage: string) {
    this.propertyRules.rules.push(new MaxIntegerRule(maxInteger, errorMessage));
    return this;
  }

  maxLength(maxLength: number, errorMessage: string) {
    this.propertyRules.rules.push(new MaxLengthRule(maxLength, errorMessage));
    return this;
  }

  maxNumber(maxNumber: number, errorMessage: string) {
    this.propertyRules.rules.push(new MaxNumberRule(maxNumber, errorMessage));
    return this;
  }

  minCurrency(maxCurrency: number, errorMessage: string) {
    this.propertyRules.rules.push(new MinCurrencyRule(maxCurrency, errorMessage));
    return this;
  }

  minDate(minDate: Date, errorMessage: string) {
    this.propertyRules.rules.push(new MinDateRule(minDate, errorMessage));
    return this;
  }

  minInteger(minInteger: number, errorMessage: string) {
    this.propertyRules.rules.push(new MinIntegerRule(minInteger, errorMessage));
    return this;
  }

  minLength(minLength: number, errorMessage: string) {
    this.propertyRules.rules.push(new MinLengthRule(minLength, errorMessage));
    return this;
  }

  minNumber(minNumber: number, errorMessage: string) {
    this.propertyRules.rules.push(new MinNumberRule(minNumber, errorMessage));
    return this;
  }

  number(errorMessage: string) {
    this.propertyRules.rules.push(new NumberRule(errorMessage));
    return this;
  }

  object(rules: PropertyRule[]) {
    this.propertyRules.rules.push(new ObjectRule(rules));
    return this;
  }

  phone(errorMessage: string) {
    this.propertyRules.rules.push(new PhoneRule(errorMessage));
    return this;
  }

  regex(regex: RegExp, errorMessage: string) {
    this.propertyRules.rules.push(new RegexRule(regex, errorMessage));
    return this;
  }

  required(errorMessage: string) {
    this.propertyRules.rules.push(new RequiredRule(errorMessage));
    return this;
  }

  when(predicate: (x?: TClass) => boolean) {
    this.propertyRules.rules[this.propertyRules.rules.length - 1].when = predicate;
    return this;
  }
}
