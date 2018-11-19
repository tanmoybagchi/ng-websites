import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  template: '<google-sign-in [client_id]="client_id" [scope]="scope" (signedIn)="onsignedIn()"></google-sign-in>'
})
export class SignInComponent {
  client_id = environment.g_oauth_client_id;
  scope = environment.g_oauth_scope;

  constructor(
    private router: Router
  ) { }

  onsignedIn() {
    this.router.navigate(['admin/dashboard'], { replaceUrl: true });
  }
}
