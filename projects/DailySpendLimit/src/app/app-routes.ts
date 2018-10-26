import { Routes } from '@angular/router';
import { ServerErrorComponent } from 'material-helpers';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SignInComponent } from './security/sign-in.component';
import { DailyLimitComponent } from './setup/daily-limit.component';
import { PermissionsComponent } from './setup/permissions.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'error', component: ServerErrorComponent },
  { path: 'setup', component: DailyLimitComponent },
  { path: 'setup/permissions', component: PermissionsComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: '', component: HomepageComponent, pathMatch: 'full' },
];
