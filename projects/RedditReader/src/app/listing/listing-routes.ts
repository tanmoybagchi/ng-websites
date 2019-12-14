import { Routes } from '@angular/router';
import { CommentsComponent } from './comments/comments.component';
import { SubredditComponent } from './subreddit/subreddit.component';

export const listingRoutes: Routes = [
  { path: 'r/:subreddit', component: SubredditComponent },
  { path: 'r/:subreddit/:article', component: CommentsComponent },
];
