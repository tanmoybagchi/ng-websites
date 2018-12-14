import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { WinesDetailComponent } from './detail/wines-detail.component';
import { WinesSummaryComponent } from './summary/wines-summary.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    WinesDetailComponent,
    WinesSummaryComponent
  ],
  exports: [
    WinesSummaryComponent
  ]
})
export class WinesModule { }
