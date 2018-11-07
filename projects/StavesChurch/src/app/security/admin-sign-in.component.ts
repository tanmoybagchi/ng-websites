import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  // tslint:disable-next-line:max-line-length
  template: '<google-sign-in [client_id]="client_id" retUrl="admin/dashboard" [scope]="scope"></google-sign-in>'
})
export class AdminSignInComponent {
  client_id = environment.client_id;
  scope = environment.scope;

  constructor() { }
}
