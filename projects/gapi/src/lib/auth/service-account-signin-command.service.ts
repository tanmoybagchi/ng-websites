import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { share, tap } from 'rxjs/operators';
import { GoogleAccessToken } from './google-access-token';

@Injectable({ providedIn: 'root' })
export class ServiceAccountSigninCommand {
  private data: GoogleAccessToken;
  private id = '';
  private initializing = false;
  private observable: Observable<GoogleAccessToken>;
  private password = '';
  private scope = '';

  constructor(
    private http: HttpClient,
  ) { }

  execute(scope: string, id: string, password: string) {
    if (this.data) {
      return of(this.data);
    }

    this.id = id;
    this.password = password;
    this.scope = scope;

    this.executeInternal();

    return this.observable;
  }

  private executeInternal() {
    if (this.initializing) {
      return;
    }

    this.initializing = true;
    this.data = null;

    const googleAuthInput = new HttpParams()
      .set('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer')
      .set('assertion', this.createJWS());

    this.observable = this.http.post<GoogleAccessToken>('https://www.googleapis.com/oauth2/v4/token', googleAuthInput).pipe(
      tap((response: GoogleAccessToken) => {
        this.data = response;

        // when the cached data is available we don't need the 'Observable' reference anymore
        this.observable = null;

        this.initializing = false;

        setTimeout(() => this.executeInternal(), (response.expires_in - 10) * 1000);
      }),
      share()
    );
  }

  private createJWS() {
    const jwtHeader = { 'alg': 'RS256', 'typ': 'JWT' };

    const jwtClaimSet = {
      aud: 'https://www.googleapis.com/oauth2/v4/token',
      scope: this.scope,
      iss: this.id,
      exp: window['KJUR'].jws.IntDate.get('now + 1hour'),
      iat: window['KJUR'].jws.IntDate.get('now')
    };

    return window['KJUR'].jws.JWS.sign(null, jwtHeader, jwtClaimSet, this.password);
  }
}
