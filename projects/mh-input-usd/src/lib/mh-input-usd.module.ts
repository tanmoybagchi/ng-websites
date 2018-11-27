import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { InputUSDComponent } from './input-usd.component';

@NgModule({
  declarations: [InputUSDComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    InputUSDComponent
  ]
})
export class MhInputUsdModule { }
