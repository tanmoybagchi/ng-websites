import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthTokenService, EventManagerService, Result, UserSignedInEvent } from 'core';
import { EMPTY, Observable, Subscriber } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GoogleAccessToken } from './google-access-token';
import { TokenVerifyCommand } from './token-verify-command.service';

@Injectable({ providedIn: 'root' })
export class SigninCommand {
  private endPoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  constructor(
    private authTokenService: AuthTokenService,
    private eventManagerService: EventManagerService,
    private tokenVerifyCommand: TokenVerifyCommand,
  ) { }

  execute(client_id: string, scope: string, oauth_Redirect_Uri: string) {
    return new Observable(observer => {
      const validationResult = this.validateInputs(client_id, scope, oauth_Redirect_Uri);
      if (validationResult.hasErrors) {
        observer.error(validationResult);
        return;
      }

      const params = this.create_oauth_params(client_id, scope, oauth_Redirect_Uri);

      const childWindow = window.open(`${this.endPoint}?${params.toString()}`, '_blank');

      const interval = window.setInterval(() => {
        try {
          this.watch_oauth_popup(observer, childWindow, interval, client_id, scope, oauth_Redirect_Uri);
        } catch (error) {
          if (error instanceof DOMException && (error.code === DOMException.SECURITY_ERR || error.name === 'SecurityError')) {
            return;
          } else {
            window.clearInterval(interval);
            observer.error(error);
          }
        }
      }, 50);
    });
  }

  private validateInputs(client_id: string, scope: string, oauth_Redirect_Uri: string) {
    const validationResult = new Result();

    // tslint:disable-next-line:no-unused-expression
    String.isNullOrWhitespace(client_id) && validationResult.addError('Required', 'client_id');

    // tslint:disable-next-line:no-unused-expression
    String.isNullOrWhitespace(scope) && validationResult.addError('Required', 'scope');

    // tslint:disable-next-line:no-unused-expression
    String.isNullOrWhitespace(oauth_Redirect_Uri) && validationResult.addError('Required', 'oauth_Redirect_Url');

    return validationResult;
  }

  private create_oauth_params(client_id: string, scope: string, oauth_Redirect_Uri: string) {
    return new HttpParams()
      .append('client_id', client_id)
      .append('redirect_uri', oauth_Redirect_Uri)
      .append('response_type', 'token')
      .append('include_granted_scopes', 'true')
      .append('scope', scope);
  }

  // tslint:disable-next-line:max-line-length
  private watch_oauth_popup(observer: Subscriber<{}>, oauth_popup: Window, interval: number, client_id: string, scope: string, oauth_Redirect_Uri: string) {
    if (!oauth_popup || oauth_popup.closed) {
      window.clearInterval(interval);

      observer.error(Result.CreateErrorResult('Something went wrong with the sign-in. Please try later.'));

      return;
    }

    if (!oauth_popup.location.href.startsWith(oauth_Redirect_Uri)) {
      return;
    }

    window.clearInterval(interval);

    const oauthFragment = oauth_popup.location.hash.slice(1);

    oauth_popup.close();

    if (String.isNullOrWhitespace(oauthFragment)) {
      observer.error(Result.CreateErrorResult('Something went wrong with the sign-in. Please try later.'));
      return;
    }

    const oauthToken = GoogleAccessToken.convertFromFragment(oauthFragment);

    this.tokenVerifyCommand.execute(oauthToken).pipe(
      catchError(_ => this.onError(observer, _))
    ).subscribe(_ => this.onTokenVerify(observer, _, client_id, oauthToken));
  }

  // tslint:disable-next-line:max-line-length
  private onTokenVerify(observer: Subscriber<{}>, tokenVerifyResult: TokenVerifyCommand.Result, client_id: string, oauthToken: GoogleAccessToken) {
    if (tokenVerifyResult.aud !== client_id) {
      observer.error(Result.CreateErrorResult('Something went wrong with the sign-in. Please try later.'));
      return;
    }

    const exp = Date.now() + oauthToken.expires_in * 1000;
    this.authTokenService.setAuthToken(`${oauthToken.token_type} ${oauthToken.access_token}`, exp);

    this.eventManagerService.raise(UserSignedInEvent);

    observer.next();
    observer.complete();
  }

  private onError(observer: Subscriber<{}>, result: Result) {
    observer.error(result);
    return EMPTY;
  }
}
