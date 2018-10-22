import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../result';
import { IndexedDBConfig } from './indexedDB-config';
import { IndexedDBConfigRules } from './indexedDB-config-rules';
import { StorageConfig } from './storage-config';

@Injectable({ providedIn: 'root' })
export class IndexedDBHelper {
  private configRules = new IndexedDBConfigRules();

  constructor(private storageConfig: StorageConfig) {
    if (!window.indexedDB) {
      throw new Error('Your browser doesn\'t support a stable version of IndexedDB.');
    }

    if (!storageConfig || String.isNullOrWhitespace(storageConfig.keyPrefix)) {
      throw new Error('Must configure.');
    }
  }

  open(config: IndexedDBConfig) {
    return new Observable<IDBDatabase>((observer) => {
      let result = new Result();

      if (!config) {
        result.addError('required', 'config');
        observer.error(result);
        return;
      }

      result = this.configRules.check(config);
      if (result.hasErrors) {
        observer.error(result);
        return;
      }

      const request = window.indexedDB.open(`${this.storageConfig.keyPrefix}.${config.dbName}`, config.dbVersion);

      request.onerror = (ev: any) => {
        result.addError('Database error: ' + ev.target.errorCode);
        observer.error(result);
      };

      request.onsuccess = (ev: any) => {
        observer.next(ev.target.result);
        observer.complete();
      };

      request.onupgradeneeded = (ev: any) => {
        const db: IDBDatabase = ev.target.result;

        config.tables.forEach(table => {
          // tslint:disable-next-line:max-line-length
          const objectStore = db.createObjectStore(table.name, { keyPath: table.key.path, autoIncrement: !!table.key.autoIncrement });
          if (Array.isArray(table.indexes)) {
            table.indexes.filter(idx => String.hasData(idx.name)).forEach(idx => {
              objectStore.createIndex(idx.name, idx.name, { unique: !!idx.unique });
            });
          }
        });
      };
    });
  }

  add(db: IDBDatabase, table: string, row: any, key?: IDBKeyRange | number | string | Date | IDBArrayKey) {
    return new Observable((observer) => {
      const transaction = db.transaction(table, 'readwrite');
      transaction.onabort = (ev) => observer.error(transaction.error);
      transaction.oncomplete = (ev) => observer.complete();

      const objectStore = transaction.objectStore(table);

      const objectStoreRequest = objectStore.add(row, key);
      objectStoreRequest.onerror = (ev) => observer.error(objectStoreRequest.error);
      objectStoreRequest.onsuccess = (ev) => observer.next(objectStoreRequest.result);
    });
  }

  clear(db: IDBDatabase, table: string) {
    return new Observable((observer) => {
      const transaction = db.transaction(table, 'readwrite');
      transaction.onabort = (ev) => observer.error(transaction.error);
      transaction.oncomplete = (ev) => observer.complete();

      const objectStore = transaction.objectStore(table);

      const objectStoreRequest = objectStore.clear();
      objectStoreRequest.onerror = (ev) => observer.error(objectStoreRequest.error);
      objectStoreRequest.onsuccess = (ev) => observer.next(objectStoreRequest.result);
    });
  }

  count(db: IDBDatabase, table: string, key: IDBKeyRange | number | string | Date | IDBArrayKey) {
    return new Observable<number>((observer) => {
      const transaction = db.transaction(table, 'readwrite');
      transaction.onabort = (ev) => observer.error(transaction.error);
      transaction.oncomplete = (ev) => observer.complete();

      const objectStore = transaction.objectStore(table);

      const objectStoreRequest = objectStore.count(key);
      objectStoreRequest.onerror = (ev) => observer.error(objectStoreRequest.error);
      objectStoreRequest.onsuccess = (ev) => observer.next(objectStoreRequest.result);
    });
  }

  delete(db: IDBDatabase, table: string, key: IDBKeyRange | number | string | Date | IDBArrayKey) {
    return new Observable((observer) => {
      const transaction = db.transaction(table, 'readwrite');
      transaction.onabort = (ev) => observer.error(transaction.error);
      transaction.oncomplete = (ev) => observer.complete();

      const objectStore = transaction.objectStore(table);

      const objectStoreRequest = objectStore.delete(key);
      objectStoreRequest.onerror = (ev) => observer.error(objectStoreRequest.error);
      objectStoreRequest.onsuccess = (ev) => observer.next(objectStoreRequest.result);
    });
  }

  get(db: IDBDatabase, table: string, key: IDBKeyRange | number | string | Date | IDBArrayKey) {
    return new Observable<any>((observer) => {
      const transaction = db.transaction(table, 'readonly');
      transaction.onabort = (ev) => observer.error(transaction.error);
      transaction.oncomplete = (ev) => observer.complete();

      const objectStore = transaction.objectStore(table);

      const objectStoreRequest = objectStore.get(key);
      objectStoreRequest.onerror = (ev) => observer.error(objectStoreRequest.error);
      objectStoreRequest.onsuccess = (ev) => observer.next(objectStoreRequest.result);
    });
  }

  getAll(db: IDBDatabase, table: string, key: IDBKeyRange | number | string | Date | IDBArrayKey, count?: number) {
    return new Observable<any[]>((observer) => {
      const transaction = db.transaction(table, 'readonly');
      transaction.onabort = (ev) => observer.error(transaction.error);
      transaction.oncomplete = (ev) => observer.complete();

      const objectStore: any = transaction.objectStore(table);

      const objectStoreRequest = objectStore.getAll(key, count);
      objectStoreRequest.onerror = (ev) => observer.error(objectStoreRequest.error);
      objectStoreRequest.onsuccess = (ev) => observer.next(objectStoreRequest.result);
    });
  }

  getAllKeys(db: IDBDatabase, table: string, key: IDBKeyRange | number | string | Date | IDBArrayKey, count?: number) {
    return new Observable<any[]>((observer) => {
      const transaction = db.transaction(table, 'readonly');
      transaction.onabort = (ev) => observer.error(transaction.error);
      transaction.oncomplete = (ev) => observer.complete();

      const objectStore: any = transaction.objectStore(table);

      const objectStoreRequest = objectStore.getAllKeys(key, count);
      objectStoreRequest.onerror = (ev) => observer.error(objectStoreRequest.error);
      objectStoreRequest.onsuccess = (ev) => observer.next(objectStoreRequest.result);
    });
  }

  getKey(db: IDBDatabase, table: string, key: IDBKeyRange | number | string | Date | IDBArrayKey) {
    return new Observable<any>((observer) => {
      const transaction = db.transaction(table, 'readonly');
      transaction.onabort = (ev) => observer.error(transaction.error);
      transaction.oncomplete = (ev) => observer.complete();

      const objectStore: any = transaction.objectStore(table);

      const objectStoreRequest = objectStore.getKey(key);
      objectStoreRequest.onerror = (ev) => observer.error(objectStoreRequest.error);
      objectStoreRequest.onsuccess = (ev) => observer.next(objectStoreRequest.result);
    });
  }

  index(db: IDBDatabase, table: string, name: string) {
    return new Observable<IDBIndex>((observer) => {
      const transaction = db.transaction(table, 'readonly');
      transaction.onabort = (ev) => observer.error(transaction.error);
      transaction.oncomplete = (ev) => observer.complete();

      const objectStore: any = transaction.objectStore(table);

      const objectStoreRequest = objectStore.index(name);
      objectStoreRequest.onerror = (ev) => observer.error(objectStoreRequest.error);
      objectStoreRequest.onsuccess = (ev) => observer.next(objectStoreRequest.result);
    });
  }

  openCursor(db: IDBDatabase, table: string, range?: IDBKeyRange | number | string | Date | IDBArrayKey, direction?: IDBCursorDirection) {
    return new Observable<IDBCursorWithValue>((observer) => {
      const transaction = db.transaction(table, 'readonly');
      transaction.onabort = (ev) => observer.error(transaction.error);
      transaction.oncomplete = (ev) => observer.complete();

      const objectStore = transaction.objectStore(table);

      const objectStoreRequest = objectStore.openCursor(range, direction);
      objectStoreRequest.onerror = (ev) => observer.error(objectStoreRequest.error);
      objectStoreRequest.onsuccess = (ev) => observer.next(objectStoreRequest.result);
    });
  }

  // tslint:disable-next-line:max-line-length
  openKeyCursor(db: IDBDatabase, table: string, range?: IDBKeyRange | number | string | Date | IDBArrayKey, direction?: IDBCursorDirection) {
    return new Observable<IDBCursor>((observer) => {
      const transaction = db.transaction(table, 'readonly');
      transaction.onabort = (ev) => observer.error(transaction.error);
      transaction.oncomplete = (ev) => observer.complete();

      const objectStore: any = transaction.objectStore(table);

      const objectStoreRequest = objectStore.openKeyCursor(range, direction);
      objectStoreRequest.onerror = (ev) => observer.error(objectStoreRequest.error);
      objectStoreRequest.onsuccess = (ev) => observer.next(objectStoreRequest.result);
    });
  }

  put(db: IDBDatabase, table: string, row: any, key?: IDBKeyRange | number | string | Date | IDBArrayKey) {
    return new Observable<any>((observer) => {
      const transaction = db.transaction(table, 'readwrite');
      transaction.onabort = (ev) => observer.error(transaction.error);
      transaction.oncomplete = (ev) => observer.complete();

      const objectStore = transaction.objectStore(table);

      const objectStoreRequest = objectStore.put(row, key);
      objectStoreRequest.onerror = (ev) => observer.error(objectStoreRequest.error);
      objectStoreRequest.onsuccess = (ev) => observer.next(objectStoreRequest.result);
    });
  }
}
