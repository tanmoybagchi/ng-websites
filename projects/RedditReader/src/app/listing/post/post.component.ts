import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PostViewModel } from './post-view-model';
import { Thing } from '@app/domain/models';

@Component({
  selector: 'rr-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent implements OnInit {
  vm: PostViewModel;
  @Input()
  public set post(v: Thing) {
    this.vm = new PostViewModel(v, this.sanitizer);
    this.changeDetector.markForCheck();
    setTimeout(() => {
      this.changeDetector.markForCheck();
    }, 0);
  }

  constructor(
    private sanitizer: DomSanitizer,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

}
