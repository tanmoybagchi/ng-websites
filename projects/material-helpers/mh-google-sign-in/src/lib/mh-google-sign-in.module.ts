import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
