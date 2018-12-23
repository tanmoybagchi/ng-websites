import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTokenService } from 'core';

@Component({
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  providers: []
})
export class HomepageComponent {
  constructor(
    private authTokenService: AuthTokenService,
    private router: Router
  ) { }

  getStarted() {
    if (String.hasData(this.authTokenService.getAuthToken())) {
      this.router.navigate(['recipes']);
    } else {
      this.router.navigate(['sign-in']);
    }
  }
}
