import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PermissionsComponent } from './permissions.component';
import { DailyLimitComponent } from './daily-limit.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    DailyLimitComponent,
    PermissionsComponent,
  ]
})
export class SetupModule { }
