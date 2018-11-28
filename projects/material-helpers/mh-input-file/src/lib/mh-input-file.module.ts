import { NgModule } from '@angular/core';
import { InputFileComponent } from './input-file.component';
import { MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [
    InputFileComponent
  ],
  imports: [
    MatButtonModule
  ],
  exports: [
    InputFileComponent
  ]
})
export class MhInputFileModule { }
