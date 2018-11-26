import { NgModule } from '@angular/core';
import { MhInputDateComponent } from './mh-input-date.component';
import { InputDateComponent } from './input-date.component';

@NgModule({
  declarations: [MhInputDateComponent, InputDateComponent],
  imports: [
  ],
  exports: [MhInputDateComponent]
})
export class MhInputDateModule { }
