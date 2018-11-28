import { NgModule } from '@angular/core';
import { PageTitleComponent } from './page-title.component';
import { MatToolbarModule } from '@angular/material';

@NgModule({
  declarations: [
    PageTitleComponent
  ],
  imports: [
    MatToolbarModule
  ],
  exports: [
    PageTitleComponent
  ]
})
export class MhPageTitleModule { }
