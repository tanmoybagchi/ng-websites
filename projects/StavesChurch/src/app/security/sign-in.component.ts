import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment as env } from '@env/environment';
import { AuthTokenService } from 'core';
import { GoogleAccessToken, ServiceAccountSigninCommand } from 'gapi';

@Component({
  template: ''
})
export class SignInComponent implements OnInit {
  constructor(
    private authTokenService: AuthTokenService,
    private router: Router,
    private serviceAccountSigninCommand: ServiceAccountSigninCommand
  ) { }

  ngOnInit() {
    this.serviceAccountSigninCommand
      .execute(env.gserviceaccountscope, env.gserviceaccount, env.gserviceaccountkey)
      .subscribe(_ => this.onSignIn(_));
  }

  private onSignIn(oauthToken: GoogleAccessToken) {
    const exp = Date.now() + oauthToken.expires_in * 1000;
    this.authTokenService.setAuthToken(`${oauthToken.token_type} ${oauthToken.access_token}`, exp);

    this.router.navigate([''], { replaceUrl: true });
  }
}
