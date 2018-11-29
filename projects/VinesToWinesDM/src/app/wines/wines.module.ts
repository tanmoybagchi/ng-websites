import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { WinesComponent } from './wines.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [WinesComponent]
})
export class WinesModule { }
