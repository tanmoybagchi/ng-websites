import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { AboutUsDetailComponent } from './about-us-detail.component';
import { AboutUsSummaryComponent } from './about-us-summary.component';

@NgModule({
  declarations: [
    AboutUsDetailComponent,
    AboutUsSummaryComponent,
  ],
  imports: [
    SharedModule
  ],
  exports: [
    AboutUsSummaryComponent,
  ]
})
export class AboutUsModule { }
