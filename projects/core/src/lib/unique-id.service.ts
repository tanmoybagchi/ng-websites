import { Injectable } from '@angular/core';
import { SessionStorageService } from './storage/session-storage.service';

@Injectable({ providedIn: 'root' })
export class UniqueIdService {
  private key = 'UniqueId';

  constructor(private sessionStorageService: SessionStorageService) { }

  getUniqueId(): number {
    let uniqueId: number = this.sessionStorageService.get(this.key);

    if (uniqueId === undefined || uniqueId === null) {
      uniqueId = 0;
    }

    this.sessionStorageService.set(this.key, ++uniqueId);

    return uniqueId;
  }
}
