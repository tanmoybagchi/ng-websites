import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
