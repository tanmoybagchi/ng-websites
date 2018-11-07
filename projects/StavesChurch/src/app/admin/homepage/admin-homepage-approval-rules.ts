import { Homepage } from '@app/homepage/homepage';
import { RuleBuilder, RulesEngine } from 'core';
import { AdminHomepage } from './admin-homepage';

export class AdminHomepageApprovalRules {
  private readonly rulesEngine: RulesEngine;

  constructor() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const contentRules = RuleBuilder.for<Homepage>()
      .property(x => x.bannerTitle).required('Please enter a title')
      .build();

    const effectiveFromMsg = 'Please enter a valid date today or in the future.';

    const rules = RuleBuilder.for<AdminHomepage>()
      .property(x => x.effectiveFrom).date(effectiveFromMsg).required(effectiveFromMsg).minDate(today, effectiveFromMsg)
      .property(x => x.content).object(contentRules)
      .build();

    this.rulesEngine = RulesEngine.create(rules);
  }

  check(model: AdminHomepage) {
    return this.rulesEngine.check(model);
  }
}
