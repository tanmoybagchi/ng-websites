import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { ListingComponent } from './listing.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ListingComponent
  ],
})
export class ListingModule { }
