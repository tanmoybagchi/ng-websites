import { Injectable } from '@angular/core';
import { SessionStorageService } from '../storage/session-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  private key = 'AuthToken';

  constructor(private sessionStorageService: SessionStorageService) { }

  setAuthToken(token: string, expiresOn?: number): void {
    this.sessionStorageService.set(this.key, token, expiresOn);
  }

  getAuthToken(): string {
    return this.sessionStorageService.get(this.key);
  }

  removeAuthToken() {
    this.sessionStorageService.remove(this.key);
  }
}
