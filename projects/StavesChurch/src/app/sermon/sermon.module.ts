import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { SermonSummaryComponent } from './sermon-summary/sermon-summary.component';
import { SermonComponent } from './sermon/sermon.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    SermonSummaryComponent,
    SermonComponent
  ],
  exports: [
    SermonSummaryComponent,
  ]
})
export class SermonModule { }
