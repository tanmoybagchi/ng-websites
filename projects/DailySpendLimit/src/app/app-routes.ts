import { Routes } from '@angular/router';
import { ServerErrorComponent } from 'material-helpers';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SignInComponent } from './security/sign-in.component';
import { SetupDailyLimitComponent } from './setup/setup-daily-limit.component';
import { SetupPermissionsComponent } from './setup/setup-permissions.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'error', component: ServerErrorComponent },
  { path: 'setup', component: SetupDailyLimitComponent },
  { path: 'setup/permissions', component: SetupPermissionsComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: '', component: HomepageComponent, pathMatch: 'full' },
];
