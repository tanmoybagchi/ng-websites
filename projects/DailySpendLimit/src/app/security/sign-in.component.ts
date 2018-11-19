import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  template: '<google-sign-in [client_id]="client_id" [scope]="scope" (signedIn)="onsignedIn()"></google-sign-in>'
})
export class SignInComponent {
  client_id = environment.client_id;
  scope = environment.scope;

  constructor(
    private router: Router
  ) { }

  onsignedIn() {
    this.router.navigate(['dashboard'], { replaceUrl: true });
  }
}
