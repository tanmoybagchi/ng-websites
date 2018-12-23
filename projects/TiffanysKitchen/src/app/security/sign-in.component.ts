import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  // tslint:disable-next-line:max-line-length
  template: '<google-sign-in [client_id]="client_id" retUrl="recipes" [scope]="scope" (signedIn)="onsignedIn()"></google-sign-in>'
})
export class SignInComponent {
  client_id = environment.client_id;
  scope = environment.scope;

  constructor(
    private router: Router
  ) { }

  onsignedIn() {
    this.router.navigate(['recipes'], { replaceUrl: true });
  }
}
