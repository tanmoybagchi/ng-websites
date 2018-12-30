import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { NewsletterComponent } from './newsletter.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    NewsletterComponent
  ],
  exports: [
  ]
})
export class NewsletterModule { }
