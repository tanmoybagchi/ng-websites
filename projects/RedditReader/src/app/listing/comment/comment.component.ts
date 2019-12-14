import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Thing } from '@app/domain/models';
import { CommentViewModel } from './comment-view-model';
import { CommentsQuery } from '../comments/comments-query.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'rr-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent {
  vm: CommentViewModel;
  gettingReplies = false;

  @Input()
  public set comment(v: Thing) {
    this.vm = new CommentViewModel(v, this.sanitizer);
    setTimeout(() => {
      this.changeDetector.markForCheck();
    }, 0);
  }

  constructor(
    private changeDetector: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private commentsQuery: CommentsQuery,
  ) { }

  moreComments() {
    this.gettingReplies = true;
    this.changeDetector.detectChanges();

    this.commentsQuery.execute(this.vm.article, this.vm.id).pipe(
      map(x => x.comments.slice(1).filter(y => y.kind === Thing.Kind.Comment).map(y => new CommentViewModel(y, this.sanitizer))),
    ).subscribe(replies => this.onMoreComments(replies));
  }

  onMoreComments(replies: CommentViewModel[]) {
    this.vm.replies = replies;
    this.gettingReplies = false;
    this.changeDetector.detectChanges();
  }
}
