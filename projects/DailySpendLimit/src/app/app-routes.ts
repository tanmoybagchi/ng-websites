import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { SignInComponent } from './security/sign-in.component';
import { ServerErrorComponent } from 'material-helpers';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SetupComponent } from './setup/setup.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'error', component: ServerErrorComponent },
  { path: 'setup', component: SetupComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: '', component: HomepageComponent, pathMatch: 'full' },
];
