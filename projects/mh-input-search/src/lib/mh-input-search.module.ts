import { NgModule } from '@angular/core';
import { MhInputSearchComponent } from './mh-input-search.component';
import { InputSearchComponent } from './input-search.component';

@NgModule({
  declarations: [MhInputSearchComponent, InputSearchComponent],
  imports: [
  ],
  exports: [MhInputSearchComponent]
})
export class MhInputSearchModule { }
