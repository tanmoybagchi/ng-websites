import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTokenService, EventManagerService, Result } from 'core';
import { SigninCommand } from 'gapi';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Component({
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  providers: []
})
export class HomepageComponent implements OnInit {
  errors: any;

  constructor(
    private authTokenService: AuthTokenService,
    private router: Router,
    private signinCommand: SigninCommand,
    private eventManagerService: EventManagerService,
  ) { }

  ngOnInit() {
  }

  onGetStarted() {
    if (this.isAuthenticated()) {
      this.router.navigate(['dashboard']);
      return;
    }

    this.eventManagerService.raise(ShowThrobberEvent);

    this.signinCommand.execute(environment.client_id, environment.scope, environment.oauth_Redirect_Uri).pipe(
      catchError(_ => this.onError(_)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.router.navigate(['dashboard']));
  }

  private isAuthenticated() {
    return !String.isNullOrWhitespace(this.authTokenService.getAuthToken());
  }

  private onError(result: Result) {
    this.errors = result.errors;
    console.log(this.errors);
    return EMPTY;
  }
}
