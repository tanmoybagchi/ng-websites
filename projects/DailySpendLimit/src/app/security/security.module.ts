import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { SignInComponent } from './sign-in.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    SignInComponent,
  ],
  providers: []
})
export class SecurityModule { }
