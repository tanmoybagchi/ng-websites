import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  // tslint:disable-next-line:max-line-length
  template: '<google-sign-in [client_id]="client_id" retUrl="dashboard" [scope]="scope" sign_in_ret_url="assets/homepage.jpg"></google-sign-in>'
})
export class SignInComponent {
  client_id = environment.client_id;
  scope = environment.scope;

  constructor() { }
}
