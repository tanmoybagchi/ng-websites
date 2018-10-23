import { Routes } from '@angular/router';
import { ServerErrorComponent } from 'material-helpers';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SignInComponent } from './security/sign-in.component';
import { CoOwnerComponent } from './setup/co-owner/co-owner.component';
import { DailyLimitComponent } from './setup/daily-limit/daily-limit.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'error', component: ServerErrorComponent },
  { path: 'setup/co-owner', component: CoOwnerComponent },
  { path: 'setup', component: DailyLimitComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: '', component: HomepageComponent, pathMatch: 'full' },
];
