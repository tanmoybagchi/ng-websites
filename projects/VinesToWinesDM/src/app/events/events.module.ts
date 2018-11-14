import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { EventSummaryComponent } from './event-summary/event-summary.component';
import { EventsComponent } from './events/events.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    EventSummaryComponent,
    EventsComponent
  ],
  exports: [
    EventSummaryComponent
  ]
})
export class EventsModule { }
