import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { InputIntegerComponent } from './input-integer.component';

@NgModule({
  declarations: [
    InputIntegerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    InputIntegerComponent
  ]
})
export class MhInputIntegerModule { }
