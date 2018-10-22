import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthTokenService, EventManagerService, Result, UserSignedInEvent } from 'core';
import { GoogleAccessToken, TokenVerifyCommand } from 'gapi';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
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
      this.router.navigate([this.retUrl]);
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
    const client_id = `client_id=${this.client_id}`;
    const redirect_uri = `redirect_uri=${encodeURI(window.location.href)}`;
    const response_type = 'response_type=token';
    const include_granted_scopes = 'include_granted_scopes=true';
    const scope = `scope=${encodeURI(this.scope)}`;

    // tslint:disable-next-line:max-line-length
    window.location.replace(`${this.endPoint}?${client_id}&${redirect_uri}&${response_type}&${scope}&${include_granted_scopes}`);
  }

  private verifyToken() {
    this.tokenVerifyCommand.execute(this.oauthToken).pipe(
      catchError(_ => this.onError(_))
    ).subscribe(_ => this.onTokenVerify(_));
  }

  private onTokenVerify(tokenVerifyResult: TokenVerifyCommand.Result) {
    if (tokenVerifyResult.aud !== this.client_id) {
      this.errors = Result.CreateErrorResult('Something went wrong with the sign-in. Please try later.').errors;
      return;
    }

    const exp = Date.now() + this.oauthToken.expires_in * 1000;
    this.authTokenService.setAuthToken(`${this.oauthToken.token_type} ${this.oauthToken.access_token}`, exp);

    this.eventManagerService.raise(UserSignedInEvent);

    this.router.navigate([this.retUrl]);
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
