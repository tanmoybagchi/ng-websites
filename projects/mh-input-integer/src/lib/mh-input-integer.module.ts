import { NgModule } from '@angular/core';
import { MhInputIntegerComponent } from './mh-input-integer.component';
import { InputIntegerComponent } from './input-integer.component';

@NgModule({
  declarations: [MhInputIntegerComponent, InputIntegerComponent],
  imports: [
  ],
  exports: [MhInputIntegerComponent]
})
export class MhInputIntegerModule { }
