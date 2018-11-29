import { AdminWines } from '@app/admin/wines/admin-wines';
import { Wine, Wines } from '@app/wines/wines';
import { RuleBuilder, RulesEngine, Result } from 'core';

export class AdminWinesApprovalRules {
  private readonly rulesEngine: RulesEngine;

  constructor() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const wineRules = RuleBuilder.for<Wine>()
      .property(x => x.name).required('Please enter a name')
      .property(x => x.description).required('Please enter a description')
      .build();

    const contentRules = RuleBuilder.for<Wines>()
      .property(x => x.reds).object(wineRules)
      .property(x => x.whites).object(wineRules)
      .property(x => x.speciality).object(wineRules)
      .build();

    const effectiveFromMsg = 'Please enter a valid date today or in the future.';

    const rules = RuleBuilder.for<AdminWines>()
      .property(x => x.effectiveFrom).date(effectiveFromMsg).required(effectiveFromMsg).minDate(today, effectiveFromMsg)
      .property(x => x.content).required('Please enter the wines')
      .property(x => x.content).object(contentRules)
      .build();

    this.rulesEngine = RulesEngine.create(rules);
  }

  private checkForDuplicateWines(wines: Wine[]) {
    const wineNames = wines
      .filter(x => String.hasData(x.name))
      .map(x => x.name)
      .sort();

    for (let index = 0; index < wineNames.length - 1; index++) {
      if (wineNames[index] === wineNames[index + 1]) {
        return Result.CreateErrorResult(`You have ${wineNames[index]} defined more than once. Please change one of their names.`);
      }
    }
  }

  check(model: AdminWines) {
    let result = this.rulesEngine.check(model);

    if (!result.hasErrors && model.content.reds.length > 0) {
      result = this.checkForDuplicateWines(model.content.reds);
    }

    if (!result.hasErrors && model.content.whites.length > 0) {
      result = this.checkForDuplicateWines(model.content.whites);
    }

    if (!result.hasErrors && model.content.speciality.length > 0) {
      result = this.checkForDuplicateWines(model.content.speciality);
    }

    return result;
  }
}
