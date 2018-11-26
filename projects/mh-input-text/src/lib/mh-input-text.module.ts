import { NgModule } from '@angular/core';
import { MhInputTextComponent } from './mh-input-text.component';
import { InputTextComponent } from './input-text.component';

@NgModule({
  declarations: [MhInputTextComponent, InputTextComponent],
  imports: [
  ],
  exports: [MhInputTextComponent]
})
export class MhInputTextModule { }
