import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { SermonSummaryComponent } from './summary/sermon-summary.component';
import { SermonDetailComponent } from './detail/sermon-detail.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    SermonSummaryComponent,
    SermonDetailComponent
  ],
  exports: [
    SermonSummaryComponent,
  ]
})
export class SermonModule { }
