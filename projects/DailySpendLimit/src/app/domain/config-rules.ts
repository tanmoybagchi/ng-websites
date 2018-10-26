import { Injectable } from '@angular/core';
import { RuleBuilder, RulesEngine } from 'core';
import { Observable } from 'rxjs';
import { Config } from './config';

@Injectable({ providedIn: 'root' })
export class ConfigRules {
  private readonly rulesEngine: RulesEngine;

  constructor() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rules = RuleBuilder.for<Config>()
      .property(x => x.dailyLimit).required('Need something').minCurrency(0.01, 'Really?')
      .property(x => x.effectiveFrom).required('Need something').minDate(today, 'Must be today or in the future')
      .build();

    this.rulesEngine = RulesEngine.create(rules);
  }

  check(model: Config) {
    return new Observable(observer => {
      const res = this.rulesEngine.check(model);

      if (res.hasErrors) {
        observer.error(res);
      } else {
        observer.next();
        observer.complete();
      }
    });
  }
}
