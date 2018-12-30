import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { EventSummaryComponent } from './summary/event-summary.component';
import { EventDetailComponent } from './detail/event-detail.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    EventSummaryComponent,
    EventDetailComponent
  ],
  exports: [
    EventSummaryComponent
  ]
})
export class EventsModule { }
