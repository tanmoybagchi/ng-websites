import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthTokenService, Result } from 'core';
import { GoogleAccessToken } from 'gapi';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'google-sign-in',
  templateUrl: './google-sign-in.component.html'
})
export class GoogleSignInComponent implements OnInit {
  @HostBinding('style.display') sd = 'flex';
  @HostBinding('style.flex') sf = '1 1 auto';
  @Input() client_id = '';
  @Input() scope = '';
  @Input() login_hint = '';
  @Output() signedIn = new EventEmitter();
  errors: any;
  private endPoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  private oauthFragment: string;

  constructor(
    private authTokenService: AuthTokenService,
    private route: ActivatedRoute,
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

    const oauthToken = GoogleAccessToken.convertFromFragment(this.oauthFragment);

    if (String.hasData(oauthToken.error)) {
      this.errors = Result.CreateErrorResult(`Sign in failed: ${oauthToken.error}`);
      return;
    }

    const exp = Date.now() + oauthToken.expires_in * 1000;
    this.authTokenService.setAuthToken(`${oauthToken.token_type} ${oauthToken.access_token}`, exp);

    this.signedIn.emit();
  }

  private isAuthenticated() {
    return !String.isNullOrWhitespace(this.authTokenService.getAuthToken());
  }

  private notGoneToGoogleYet() {
    return String.isNullOrWhitespace(this.oauthFragment);
  }

  private sendToGoogle() {
    let params = new HttpParams()
      .append('client_id', this.client_id)
      .append('redirect_uri', window.location.href)
      .append('response_type', 'token')
      .append('include_granted_scopes', 'true')
      .append('scope', this.scope);

    if (String.hasData(this.login_hint)) {
      params = params.append('login_hint', this.login_hint);
    }

    window.location.replace(`${this.endPoint}?${params.toString()}`);
  }
}
