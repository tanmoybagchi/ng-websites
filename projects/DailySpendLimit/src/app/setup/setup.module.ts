import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SetupComponent } from './setup.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    SetupComponent
  ]
})
export class SetupModule { }
