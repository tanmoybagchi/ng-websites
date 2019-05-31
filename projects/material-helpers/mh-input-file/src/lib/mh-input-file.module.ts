import { NgModule } from '@angular/core';
import { InputFileComponent } from './input-file.component';
import { MatButtonModule } from '@angular/material/button';

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
