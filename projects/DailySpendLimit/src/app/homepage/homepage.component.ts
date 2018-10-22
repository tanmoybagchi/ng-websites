import { Component, OnInit } from '@angular/core';
import { AuthTokenService } from 'core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  providers: []
})
export class HomepageComponent implements OnInit {
  constructor(
    private authTokenService: AuthTokenService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  onGetStarted() {
    if (this.isAuthenticated()) {
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['sign-in'], { replaceUrl: true });
    }
  }

  private isAuthenticated() {
    return !String.isNullOrWhitespace(this.authTokenService.getAuthToken());
  }
}
