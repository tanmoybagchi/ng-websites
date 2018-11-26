import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule, MatProgressSpinnerModule } from '@angular/material';
import { GoogleSignInComponent } from './google-sign-in.component';

@NgModule({
  declarations: [
    GoogleSignInComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    GoogleSignInComponent
  ]
})
export class MhGoogleSignInModule { }
