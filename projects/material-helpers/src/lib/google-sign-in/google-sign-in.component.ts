import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTokenService, EventManagerService, Result, UserSignedInEvent } from 'core';
import { GoogleAccessToken, TokenVerifyCommand } from 'gapi';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HideThrobberEvent, ShowThrobberEvent } from '../throbber/throbber-events';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'google-sign-in',
  templateUrl: './google-sign-in.component.html'
})
export class GoogleSignInComponent implements OnInit {
  @Input() client_id = '';
  @Input() retUrl = '';
  @Input() scope = '';
  @Input() sign_in_ret_url = 'assets/homepage.jpg';
  errors: any;
  private childWindow: Window;
  private endPoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  private interval: number;
  private oauthToken: GoogleAccessToken;
  private redirect_uri: string;

  constructor(
    private authTokenService: AuthTokenService,
    private eventManagerService: EventManagerService,
    private router: Router,
    private tokenVerifyCommand: TokenVerifyCommand,
  ) { }

  ngOnInit() {
    if (this.isAuthenticated()) {
      this.router.navigate([this.retUrl]);
      return;
    }

    this.sendToGoogle();
  }

  private isAuthenticated() {
    return !String.isNullOrWhitespace(this.authTokenService.getAuthToken());
  }

  private sendToGoogle() {
    const client_id = `client_id=${this.client_id}`;
    this.redirect_uri = `${window.location.origin}/${this.sign_in_ret_url}`;
    const redirect_uri_param = `redirect_uri=${encodeURI(`${window.location.href.replace('sign-in', this.sign_in_ret_url)}`)}`;
    const response_type = 'response_type=token';
    const include_granted_scopes = 'include_granted_scopes=true';
    const scope = `scope=${encodeURI(this.scope)}`;

    // tslint:disable-next-line:max-line-length
    this.childWindow = window.open(`${this.endPoint}?${client_id}&${redirect_uri_param}&${response_type}&${scope}&${include_granted_scopes}`, '_blank');

    this.eventManagerService.raise(ShowThrobberEvent);
    this.interval = window.setInterval(() => {
      try {
        this.onSignin();
      } catch (error) {
        if (error instanceof DOMException && (error.code === DOMException.SECURITY_ERR || error.name === 'SecurityError')) {
          return;
        } else {
          throw error;
        }
      }
    }, 50);
  }

  onSignin() {
    if (!this.childWindow || this.childWindow.closed) {
      this.eventManagerService.raise(HideThrobberEvent);

      window.clearInterval(this.interval);

      this.onError(Result.CreateErrorResult('Something went wrong with the sign-in. Please try later.'));

      return;
    }

    if (!this.childWindow.location.href.startsWith(this.redirect_uri)) {
      return;
    }

    this.eventManagerService.raise(HideThrobberEvent);

    window.clearInterval(this.interval);

    const oauthFragment = this.childWindow.location.hash.slice(1);

    this.childWindow.close();

    if (String.isNullOrWhitespace(oauthFragment)) {
      this.onError(Result.CreateErrorResult('Something went wrong with the sign-in. Please try later.'));
      return;
    }

    this.oauthToken = GoogleAccessToken.convertFromFragment(oauthFragment);

    this.tokenVerifyCommand.execute(this.oauthToken).pipe(
      catchError(_ => this.onError(_))
    ).subscribe(_ => this.onTokenVerify(_));
  }

  private onTokenVerify(tokenVerifyResult: TokenVerifyCommand.Result) {
    if (tokenVerifyResult.aud !== this.client_id) {
      this.onError(Result.CreateErrorResult('Something went wrong with the sign-in. Please try later.'));
      return;
    }

    const exp = Date.now() + this.oauthToken.expires_in * 1000;
    this.authTokenService.setAuthToken(`${this.oauthToken.token_type} ${this.oauthToken.access_token}`, exp);

    this.eventManagerService.raise(UserSignedInEvent);

    this.router.navigate([this.retUrl], { replaceUrl: true });
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
