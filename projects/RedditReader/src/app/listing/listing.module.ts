import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PostComponent } from './post/post.component';
import { SubredditComponent } from './subreddit/subreddit.component';

@NgModule({
  imports: [
    SharedModule
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
