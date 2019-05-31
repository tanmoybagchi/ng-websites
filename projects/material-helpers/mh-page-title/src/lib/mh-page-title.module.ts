import { NgModule } from '@angular/core';
import { PageTitleComponent } from './page-title.component';
import { MatToolbarModule } from '@angular/material/toolbar';

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
