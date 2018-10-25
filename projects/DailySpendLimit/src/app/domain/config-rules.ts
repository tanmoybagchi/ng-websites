import { Injectable } from '@angular/core';
import { RuleBuilder, RulesEngine } from 'core';
import { Observable } from 'rxjs';
import { Config } from './config';

@Injectable({ providedIn: 'root' })
export class ConfigRules {
  private readonly rulesEngine: RulesEngine;

  constructor() {
    const rules = RuleBuilder.for<Config>()
      .property(x => x.dailyLimit).required('Need something').minCurrency(0.01, 'Really?')
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
