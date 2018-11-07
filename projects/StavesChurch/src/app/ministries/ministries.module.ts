import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { MinistriesComponent } from './ministries.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [MinistriesComponent]
})
export class MinistriesModule { }
