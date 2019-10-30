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
    setTimeout(() => {
      this.changeDetector.markForCheck();
    }, 0);
  }

  constructor(
    private sanitizer: DomSanitizer,
    private changeDetector: ChangeDetectorRef
  ) {
    /* if (navigator.share) {
      navigator.share({
        title: 'Web Fundamentals',
        text: 'Check out Web Fundamentals — it rocks!',
        url: 'https://developers.google.com/web',
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }

    if (navigator.canShare && navigator.canShare({ files: filesArray })) {
      navigator.share({
        files: filesArray,
        title: 'Vacation Pictures',
        text: 'Barb\nHere are the pictures from our vacation.\n\nJoe',
      })
        .then(() => console.log('Share was successful.'))
        .catch((error) => console.log('Sharing failed', error));
    } else {
      console.log('Your system doesn\'t support sharing files.');
    } */
  }

  ngOnInit() {
  }

}
