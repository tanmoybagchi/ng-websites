export interface IndexedDBConfig {
  dbName: string;
  dbVersion: number;
  tables: IndexedDBTable[];
}

export interface IndexedDBTable {
  name: string;
  key: IndexedDBTableKey;
  indexes?: IndexedDBTableIndex[];
}

export interface IndexedDBTableKey {
  path?: string | string[];
  autoIncrement?: boolean;
}

export interface IndexedDBTableIndex {
  name: string;
  unique?: boolean;
}
