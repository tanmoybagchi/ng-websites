import { Routes } from '@angular/router';
import { ServerErrorComponent } from 'mh-server-error';
import { HomepageComponent } from './homepage/homepage.component';
import { ListingComponent } from './listing/listing.component';

export const routes: Routes = [
  { path: 'error', component: ServerErrorComponent },
  { path: '', component: ListingComponent, pathMatch: 'full' },
];
