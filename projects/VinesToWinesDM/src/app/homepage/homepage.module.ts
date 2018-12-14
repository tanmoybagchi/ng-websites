import { NgModule } from '@angular/core';
import { AboutUsModule } from '@app/about-us/about-us.module';
import { EventsModule } from '@app/events/events.module';
import { SharedModule } from '@app/shared/shared.module';
import { WinesModule } from '@app/wines/wines.module';
import { HomepageBannerComponent } from './banner/homepage-banner.component';
import { HomepageComponent } from './homepage.component';

@NgModule({
  imports: [
    AboutUsModule,
    EventsModule,
    SharedModule,
    WinesModule,
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
