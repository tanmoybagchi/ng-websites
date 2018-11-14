import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { EventsSummaryComponent } from './events-summary/events-summary.component';
import { EventsDetailComponent } from './events-detail/events-detail.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    EventsSummaryComponent,
    EventsDetailComponent
  ],
  exports: [
    EventsSummaryComponent
  ]
})
export class EventsModule { }
