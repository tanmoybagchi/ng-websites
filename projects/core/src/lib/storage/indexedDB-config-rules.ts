import { IndexedDBConfig, IndexedDBTable } from './indexedDB-config';
import { RulesEngine } from '../rules-engine/rules-engine';
import { RuleBuilder } from '../rules-engine/rule-builder';

export class IndexedDBConfigRules {
  private readonly rulesEngine: RulesEngine;

  constructor() {
    const tableRules = RuleBuilder.for<IndexedDBTable>()
      .property(x => x.name).required('required')
      .property(x => x.key).required('required')
      .build();

    const dbVersionErrMsg = 'Must be a integer greater than 0.';

    const rules = RuleBuilder.for<IndexedDBConfig>()
      .property(x => x.dbName).required('required')
      .property(x => x.dbVersion).required(dbVersionErrMsg).integer(dbVersionErrMsg).minInteger(0, dbVersionErrMsg)
      .property(x => x.tables).required('required').object(tableRules)
      .build();

    this.rulesEngine = RulesEngine.create(rules);
  }

  check(model: IndexedDBConfig) {
    return this.rulesEngine.check(model);
  }
}
