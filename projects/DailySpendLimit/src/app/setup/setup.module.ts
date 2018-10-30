import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SetupPermissionsComponent } from './setup-permissions.component';
import { SetupDailyLimitComponent } from './setup-daily-limit.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    SetupDailyLimitComponent,
    SetupPermissionsComponent,
  ]
})
export class SetupModule { }
