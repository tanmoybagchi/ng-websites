import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { listingRoutes } from './listing-routes';
import { PostComponent } from './post/post.component';
import { SubredditComponent } from './subreddit/subreddit.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(listingRoutes),
  ],
  declarations: [
    PostComponent,
    SubredditComponent
  ],
  exports: [
    SubredditComponent
  ]
})
export class ListingModule { }
