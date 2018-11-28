import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { InputSearchComponent } from './input-search.component';

@NgModule({
  declarations: [
    InputSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    InputSearchComponent
  ]
})
export class MhInputSearchModule { }
