import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Thing } from '@app/domain/models';
import { CommentViewModel } from './comment-view-model';

@Component({
  selector: 'rr-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent {
  vm: CommentViewModel;

  @Input()
  public set comment(v: Thing) {
    this.vm = new CommentViewModel(v, this.sanitizer);
    console.log({ raw: v, vm: this.vm });
    setTimeout(() => {
      this.changeDetector.markForCheck();
    }, 0);
  }

  constructor(
    private changeDetector: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
  ) {
  }

}
