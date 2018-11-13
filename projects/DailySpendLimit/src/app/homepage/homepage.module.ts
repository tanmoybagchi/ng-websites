import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { HomepageComponent } from './homepage.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    HomepageComponent,
  ],
  exports: [
  ]
})
export class HomepageModule { }
