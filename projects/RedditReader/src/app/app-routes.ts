import { Routes } from '@angular/router';
import { ServerErrorComponent } from 'mh-server-error';
import { SubredditComponent } from './listing/subreddit/subreddit.component';

export const routes: Routes = [
  { path: 'error', component: ServerErrorComponent },
  { path: '', pathMatch: 'full', component: SubredditComponent },
];
