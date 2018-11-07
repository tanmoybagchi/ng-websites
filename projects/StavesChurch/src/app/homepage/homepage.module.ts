import { NgModule } from '@angular/core';
import { AnnouncementModule } from '@app/announcement/announcement.module';
import { EventsModule } from '@app/events/events.module';
import { SharedModule } from '@app/shared/shared.module';
import { SermonModule } from '../sermon/sermon.module';
import { HomepageBannerComponent } from './banner/homepage-banner.component';
import { HomepageComponent } from './homepage.component';

@NgModule({
  imports: [
    AnnouncementModule,
    EventsModule,
    SermonModule,
    SharedModule,
  ],
  declarations: [
    HomepageBannerComponent,
    HomepageComponent,
  ],
  exports: [
    HomepageBannerComponent,
  ]
})
export class HomepageModule { }
