import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { AnnouncementSummaryComponent } from './announcement-summary/announcement-summary.component';
import { AnnouncementsComponent } from './announcements/announcements.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    AnnouncementsComponent,
    AnnouncementSummaryComponent
  ],
  exports: [
    AnnouncementSummaryComponent
  ]
})
export class AnnouncementModule { }
