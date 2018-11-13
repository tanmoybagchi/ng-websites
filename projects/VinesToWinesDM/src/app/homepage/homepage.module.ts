import { NgModule } from '@angular/core';
import { AboutUsModule } from '@app/about-us/about-us.module';
import { SharedModule } from '@app/shared/shared.module';
import { HomepageBannerComponent } from './banner/homepage-banner.component';
import { HomepageComponent } from './homepage.component';

@NgModule({
  imports: [
    AboutUsModule,
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
