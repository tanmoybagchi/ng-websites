import { Routes } from '@angular/router';
import { HomepageComponent } from '@app/homepage/homepage.component';
import { AdminGuard } from '@app/security/admin.guard';
import { PageViewComponent } from 'material-cms-view';
import { ServerErrorComponent } from 'mh-server-error';
import { AboutUsDetailComponent } from './about-us/about-us-detail.component';
import { EventsDetailComponent } from './events/events-detail/events-detail.component';
import { SignInComponent } from './security/sign-in.component';
import { WinesDetailComponent } from './wines/detail/wines-detail.component';

export const routes: Routes = [
  { path: 'about-us', component: AboutUsDetailComponent },
  { path: 'admin', loadChildren: '@app/admin/admin.module#AdminModule', canLoad: [AdminGuard] },
  { path: 'error', component: ServerErrorComponent },
  { path: 'events', component: EventsDetailComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'wines', component: WinesDetailComponent },
  { path: ':kind', component: PageViewComponent },
  { path: '', component: HomepageComponent, pathMatch: 'full' },
];
