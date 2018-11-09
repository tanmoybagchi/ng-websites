import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthTokenService, CoreModule } from 'core';
import { noop, Observable, of } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';
import { GoogleAccessToken } from './google-access-token';
import { ServiceAccount } from './service-account';

@Injectable({ providedIn: 'root' })
export class ServiceAccountSigninCommand {
  private initializing = false;
  private observable: Observable<void>;

  constructor(
    private http: HttpClient,
    private serviceAccount: ServiceAccount,
    private authTokenService: AuthTokenService,
  ) { }

  execute() {
    if (String.hasData(this.authTokenService.getAuthToken())) {
      return of(noop());
    }

    this.executeInternal();

    return this.observable;
  }

  private executeInternal() {
    if (this.initializing) {
      return;
    }

    this.initializing = true;

    const googleAuthInput = new HttpParams()
      .set('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer')
      .set('assertion', this.createJWS());

    this.observable = this.http.post('https://www.googleapis.com/oauth2/v4/token', googleAuthInput).pipe(
      map((response: GoogleAccessToken) => {
        // when the cached data is available we don't need the 'Observable' reference anymore
        this.observable = null;

        this.initializing = false;

        const exp = Date.now() + (response.expires_in - 10) * 1000;
        this.authTokenService.setAuthToken(`${response.token_type} ${response.access_token}`, exp);

        return;
      }),
      share()
    );
  }

  private createJWS() {
    const jwtHeader = { 'alg': 'RS256', 'typ': 'JWT' };

    const jwtClaimSet = {
      aud: 'https://www.googleapis.com/oauth2/v4/token',
      scope: this.serviceAccount.scope,
      iss: this.serviceAccount.id,
      exp: window['KJUR'].jws.IntDate.get('now + 1hour'),
      iat: window['KJUR'].jws.IntDate.get('now')
    };

    return window['KJUR'].jws.JWS.sign(null, jwtHeader, jwtClaimSet, this.serviceAccount.password);
  }
}

export function ServiceAccountSignin() {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod: Function = descriptor.value;

    descriptor.value = function () {
      const args = arguments;

      return CoreModule.injector.get(ServiceAccountSigninCommand).execute().pipe(
        switchMap(_ => originalMethod.apply(this, args))
      );
    };

    return descriptor;
  };
}
