import { AboutUs } from '@app/about-us/about-us';
import { Result, RuleBuilder, RulesEngine } from 'core';
import { AdminAboutUs } from './admin-about-us';

export class AdminAboutUsApprovalRules {
  private readonly rulesEngine: RulesEngine;

  constructor() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const effectiveFromMsg = 'Please enter a valid date today or in the future.';

    const contentRules = RuleBuilder.for<AboutUs>()
      .property(x => x.summary).required('Please enter a summary.')
      .property(x => x.detail).required('Please enter something.')
      .build();

    const rules = RuleBuilder.for<AdminAboutUs>()
      .property(x => x.effectiveFrom).date(effectiveFromMsg).required(effectiveFromMsg).minDate(today, effectiveFromMsg)
      .property(x => x.content).required('Please enter the summary and detail')
      .property(x => x.content).object(contentRules)
      .build();

    this.rulesEngine = RulesEngine.create(rules);
  }

  check(model: AdminAboutUs): Result {
    return this.rulesEngine.check(model);
  }
}
