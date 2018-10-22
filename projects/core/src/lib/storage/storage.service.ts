export class StorageService {
  private cleaningUp = false;

  constructor(private storage: Storage, private keyPrefix: string) {
    window.setInterval(() => this.cleanUp(), 5000);
  }

  set(key: string, value: any, expiresOn?: number): void {
    const itemKey = this.createItemKey(key);

    const storageItem = new StorageItem();
    storageItem.value = value;

    // tslint:disable-next-line:no-unused-expression
    expiresOn !== undefined && expiresOn !== null && !isNaN(Number(expiresOn)) && (storageItem.expiresOn = Number(expiresOn));

    this.storage.setItem(itemKey, JSON.stringify(storageItem));
  }

  get(key: string): any {
    const itemKey = this.createItemKey(key);
    const storageItem = JSON.parse(this.storage.getItem(itemKey));

    return storageItem && storageItem.value;
  }

  remove(key: string): void {
    this.storage.removeItem(this.createItemKey(key));
  }

  private cleanUp() {
    if (this.cleaningUp) {
      return;
    }

    this.cleaningUp = true;

    const keysToRemove = [];
    const now = Date.now();
    const keyPrefixLength = this.keyPrefix.length;

    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);

      if (key.substring(0, keyPrefixLength) !== this.keyPrefix) {
        continue;
      }

      const item = JSON.parse(this.storage.getItem(key));

      // tslint:disable-next-line:no-unused-expression
      ('expiresOn' in item) && (now > item.expiresOn) && (keysToRemove.push(key));
    }

    keysToRemove.forEach((x) => this.storage.removeItem(x));

    this.cleaningUp = false;
  }

  private createItemKey(key: string) {
    return `${this.keyPrefix}.${key}`;
  }
}

class StorageItem {
  value: any;
  expiresOn: number;
}
