import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { HomepageComponent } from './homepage.component';
import { ListingModule } from '@app/listing/listing.module';

@NgModule({
  imports: [
    SharedModule,
    ListingModule
  ],
  declarations: [
    HomepageComponent
  ],
})
export class HomepageModule { }
