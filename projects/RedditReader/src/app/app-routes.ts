import { Routes } from '@angular/router';
import { ServerErrorComponent } from 'mh-server-error';

export const routes: Routes = [
  { path: 'error', component: ServerErrorComponent },
  { path: '', pathMatch: 'full', redirectTo: 'r/popular' },
];
