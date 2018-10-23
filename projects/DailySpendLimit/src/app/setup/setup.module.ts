import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CoOwnerComponent } from './co-owner/co-owner.component';
import { DailyLimitComponent } from './daily-limit/daily-limit.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    DailyLimitComponent,
    CoOwnerComponent,
  ]
})
export class SetupModule { }
