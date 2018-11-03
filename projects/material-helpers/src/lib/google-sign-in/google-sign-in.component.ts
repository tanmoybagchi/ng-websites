import { HttpParams } from '@angular/common/http';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthTokenService, EventManagerService, Result, UserSignedInEvent } from 'core';
import { GoogleAccessToken, TokenVerifyCommand } from 'gapi';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'google-sign-in',
  templateUrl: './google-sign-in.component.html'
})
export class GoogleSignInComponent implements OnInit {
  @HostBinding('style.display') sd = 'flex';
  @HostBinding('style.flex') sf = '1 1 auto';
  @Input() client_id = '';
  @Input() retUrl = '';
  @Input() scope = '';
  errors: any;
  private endPoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  private oauthFragment: string;
  private oauthToken: GoogleAccessToken;

  constructor(
    private authTokenService: AuthTokenService,
    private eventManagerService: EventManagerService,
    private route: ActivatedRoute,
    private router: Router,
    private tokenVerifyCommand: TokenVerifyCommand,
  ) { }

  ngOnInit() {
    if (this.isAuthenticated()) {
      window.history.back();
      return;
    }

    this.route.fragment.subscribe(value => this.onFragment(value));
  }

  private onFragment(fragment: string) {
    this.oauthFragment = fragment;

    if (this.notGoneToGoogleYet()) {
      this.sendToGoogle();
      return;
    }

    this.oauthToken = GoogleAccessToken.convertFromFragment(this.oauthFragment);

    this.verifyToken();
  }

  private isAuthenticated() {
    return !String.isNullOrWhitespace(this.authTokenService.getAuthToken());
  }

  private notGoneToGoogleYet() {
    return String.isNullOrWhitespace(this.oauthFragment);
  }

  private sendToGoogle() {
    const params = new HttpParams()
      .append('client_id', this.client_id)
      .append('redirect_uri', window.location.href)
      .append('response_type', 'token')
      .append('include_granted_scopes', 'true')
      .append('scope', this.scope);

    window.location.replace(`${this.endPoint}?${params.toString()}`);
  }

  private verifyToken() {
    this.tokenVerifyCommand.execute(this.oauthToken).pipe(
      catchError(_ => this.onError(_))
    ).subscribe(_ => this.onTokenVerify(_));
  }

  private onTokenVerify(tokenVerifyResult: TokenVerifyCommand.Result) {
    if (tokenVerifyResult.aud !== this.client_id) {
      const result = new Result();
      result.addError('Something went wrong with the sign-in. Please try later.');
      this.errors = result.errors;
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
