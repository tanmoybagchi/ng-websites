import { SermonContent } from '@app/sermon/sermon';
import { RuleBuilder, RulesEngine } from 'core';
import { AdminSermon } from './admin-sermon';

export class AdminSermonApprovalRules {
  private readonly rulesEngine: RulesEngine;

  constructor() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const contentRules = RuleBuilder.for<SermonContent>()
      .property(x => x.title).required('Please enter a title')
      .property(x => x.location).required('Please upload something.')
      .build();

    const effectiveFromMsg = 'Please enter a valid date today or in the future.';

    const rules = RuleBuilder.for<AdminSermon>()
      .property(x => x.effectiveFrom).date(effectiveFromMsg).required(effectiveFromMsg).minDate(today, effectiveFromMsg)
      .property(x => x.content).object(contentRules)
      .build();

    this.rulesEngine = RulesEngine.create(rules);
  }

  check(model: AdminSermon) {
    return this.rulesEngine.check(model);
  }
}
