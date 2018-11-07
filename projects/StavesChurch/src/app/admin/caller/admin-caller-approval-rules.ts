import { CallerContent } from '@app/caller/caller';
import { RuleBuilder, RulesEngine } from 'core';
import { AdminCaller } from './admin-caller';

export class AdminCallerApprovalRules {
  private readonly rulesEngine: RulesEngine;

  constructor() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const contentRules = RuleBuilder.for<CallerContent>()
      .property(x => x.title).required('Please enter a title')
      .property(x => x.location).required('Please upload something.')
      .build();

    const effectiveFromMsg = 'Please enter a valid date today or in the future.';

    const rules = RuleBuilder.for<AdminCaller>()
      .property(x => x.effectiveFrom).date(effectiveFromMsg).required(effectiveFromMsg).minDate(today, effectiveFromMsg)
      .property(x => x.content).object(contentRules)
      .build();

    this.rulesEngine = RulesEngine.create(rules);
  }

  check(model: AdminCaller) {
    return this.rulesEngine.check(model);
  }
}
