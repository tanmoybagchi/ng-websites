import { AdminWines, AdminWinesPage, AdminWineType } from '@app/admin/wines/admin-wines';
import { Wine } from '@app/wines/wines';
import { Result, RuleBuilder, RulesEngine } from 'core';

export class AdminWinesApprovalRules {
  private readonly rulesEngine: RulesEngine;

  constructor() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const effectiveFromMsg = 'Please enter a valid date today or in the future.';

    const wineRules = RuleBuilder.for<Wine>()
      .property(x => x.name).required('Please enter a name')
      .property(x => x.description).required('Please enter a description')
      .build();

    const wineTypeRules = RuleBuilder.for<AdminWineType>()
      .property(x => x.name).required('Please enter a name')
      .property(x => x.wines).object(wineRules)
      .build();

    const adminWinesRules = RuleBuilder.for<AdminWines>()
      .property(x => x.summary).required('Please enter a summary.')
      .property(x => x.wineTypes).object(wineTypeRules)
      .build();

    const rules = RuleBuilder.for<AdminWinesPage>()
      .property(x => x.effectiveFrom).date(effectiveFromMsg).required(effectiveFromMsg).minDate(today, effectiveFromMsg)
      .property(x => x.content).required('Please enter the wines')
      .property(x => x.content).object(adminWinesRules)
      .build();

    this.rulesEngine = RulesEngine.create(rules);
  }

  private checkForDuplicateWines(wines: Wine[], result: Result) {
    const wineNames = wines
      .filter(x => String.hasData(x.name))
      .map(x => x.name)
      .sort();

    for (let index = 0; index < wineNames.length - 1; index++) {
      if (wineNames[index] === wineNames[index + 1]) {
        result.addError(`You have ${wineNames[index]} defined more than once. Please change one of their names.`);
      }
    }
  }

  check(model: AdminWinesPage) {
    const result = this.rulesEngine.check(model);

    model.content.wineTypes.forEach(wt => {
      if (!result.hasErrors && wt.wines.length > 0) {
        this.checkForDuplicateWines(wt.wines, result);
      }
    });

    return result;
  }
}
