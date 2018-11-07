import { AdminMinistries } from '@app/admin/ministries/admin-ministries';
import { Ministries, Ministry } from '@app/ministries/ministries';
import { RuleBuilder, RulesEngine } from 'core';

export class AdminMinistriesApprovalRules {
  private readonly rulesEngine: RulesEngine;

  constructor() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ministryRules = RuleBuilder.for<Ministry>()
      .property(x => x.name).required('Please enter a name')
      .property(x => x.purpose).required('Please enter a description')
      .build();

    const contentRules = RuleBuilder.for<Ministries>()
      .property(x => x.header).required('Please enter a description')
      .property(x => x.list).object(ministryRules)
      .build();

    const effectiveFromMsg = 'Please enter a valid date today or in the future.';

    const rules = RuleBuilder.for<AdminMinistries>()
      .property(x => x.effectiveFrom).date(effectiveFromMsg).required(effectiveFromMsg).minDate(today, effectiveFromMsg)
      .property(x => x.content).required('Please enter the ministries')
      .property(x => x.content).object(contentRules)
      .build();

    this.rulesEngine = RulesEngine.create(rules);
  }

  check(model: AdminMinistries) {
    const result = this.rulesEngine.check(model);

    if (model.content.list.length > 1) {
      const ministryNames = model.content.list
        .filter(x => String.hasData(x.name))
        .map(x => x.name)
        .sort();

      for (let index = 0; index < ministryNames.length - 1; index++) {
        if (ministryNames[index] === ministryNames[index + 1]) {
          result.addError(`You have ${ministryNames[index]} defined more than once. Please change one of their names.`);
          break;
        }
      }
    }

    return result;
  }
}
