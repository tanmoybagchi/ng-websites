import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { InputEmailComponent } from './input-email.component';

@NgModule({
  declarations: [
    InputEmailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    InputEmailComponent
  ]
})
export class MhInputEmailModule { }
