import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { AnnouncementSummaryComponent } from './summary/announcement-summary.component';
import { AnnouncementDetailComponent } from './detail/announcement-detail.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    AnnouncementDetailComponent,
    AnnouncementSummaryComponent
  ],
  exports: [
    AnnouncementSummaryComponent
  ]
})
export class AnnouncementModule { }
