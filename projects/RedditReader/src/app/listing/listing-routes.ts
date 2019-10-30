import { Routes } from '@angular/router';
import { SubredditComponent } from './subreddit/subreddit.component';

export const listingRoutes: Routes = [
  { path: 'r/:subreddit', component: SubredditComponent },
];
