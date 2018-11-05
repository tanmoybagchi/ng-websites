import { IndexedDBConfig, IndexedDBTable, IndexedDBTableKey } from 'core';

export class DatabaseConfig implements IndexedDBConfig {
  dbName = 'slow cooker';
  dbVersion = 1;
  tables = [new IngredientTable()];
}

export class IngredientTable implements IndexedDBTable {
  name = 'ingredient';
  key = new IngredientKey();
}

export class IngredientKey implements IndexedDBTableKey {
  path = 'name';
}
