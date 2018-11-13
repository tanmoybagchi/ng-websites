import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PageComponent } from './page.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [PageComponent]
})
export class PageModule { }
