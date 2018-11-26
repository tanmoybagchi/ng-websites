import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material';
import { GeneralErrorComponent } from './general-error.component';

@NgModule({
  declarations: [
    GeneralErrorComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule
  ],
  exports: [
    GeneralErrorComponent
  ]
})
export class MhGeneralErrorModule { }
