import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { CallerComponent } from './caller.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    CallerComponent
  ],
  exports: [
  ]
})
export class CallerModule { }
