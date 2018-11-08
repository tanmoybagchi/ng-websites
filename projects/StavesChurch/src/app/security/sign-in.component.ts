import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    this.serviceAccountSigninCommand.execute().subscribe(_ => this.onSignIn());
  }

  private onSignIn() {
    this.router.navigate([''], { replaceUrl: true });
  }
}
