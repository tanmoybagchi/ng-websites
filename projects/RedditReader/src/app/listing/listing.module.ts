import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { listingRoutes } from './listing-routes';
import { PostComponent } from './post/post.component';
import { SubredditComponent } from './subreddit/subreddit.component';
import { CommentComponent } from './comment/comment.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(listingRoutes),
  ],
  declarations: [
    PostComponent,
    SubredditComponent,
    CommentComponent,
  ],
  exports: [
    SubredditComponent,
    CommentComponent,
  ]
})
export class ListingModule { }
