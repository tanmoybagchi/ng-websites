import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { SignInComponent } from './sign-in.component';
import { AdminSignInComponent } from './admin-sign-in.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    AdminSignInComponent,
    SignInComponent
  ],
  providers: []
})
export class SecurityModule { }
