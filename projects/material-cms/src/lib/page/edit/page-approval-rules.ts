import { RuleBuilder, RulesEngine, Result } from 'core';
import { Page } from '../../page';

export class PageApprovalRules {
  private readonly rulesEngine: RulesEngine;

  constructor() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const effectiveFromMsg = 'Please enter a valid date today or in the future.';
    const contentMsg = 'Please enter something.';

    const rules = RuleBuilder.for<Page>()
      .property(x => x.effectiveFrom).date(effectiveFromMsg).required(effectiveFromMsg).minDate(today, effectiveFromMsg)
      .property(x => x.content).required(contentMsg)
      .build();

    this.rulesEngine = RulesEngine.create(rules);
  }

  check(model: Page) {
    // I should be able to just do 'return this.rulesEngine.check(model);'
    // However the compiler can't handle it as it can't find the definition for Result.
    // If I just add Result to the imports, VSCode might remove it trying to optimize.
    // So this workaround.
    let res: Result;
    res = this.rulesEngine.check(model);
    return res;
  }
}
