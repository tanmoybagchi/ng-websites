import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PostViewModel } from './post-view-model';
import { Thing } from '@app/domain/models';
import { fromEvent, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'rr-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent implements OnInit {
  vm: PostViewModel;
  canShare: boolean;
  nav: any;

  @Input()
  public set post(v: Thing) {
    this.vm = new PostViewModel(v, this.sanitizer);
    setTimeout(() => {
      this.changeDetector.markForCheck();
    }, 0);
  }

  @ViewChild('imgPost', { static: false })
  imgPostElRef: ElementRef;

  constructor(
    private sanitizer: DomSanitizer,
    private changeDetector: ChangeDetectorRef
  ) {
    this.nav = navigator as any;
    // this.canShare = this.nav.share || this.nav.canShare;
    this.canShare = true;
  }

  ngOnInit() {
  }

  share() {
    /* let img: HTMLImageElement;

    console.log({ i: this.vm.hasImage, v: this.vm.hasVideo, t: this.vm.hasText, l: this.vm.hasLink, e: this.vm.hasEmbed });

    if (this.imgPostElRef && this.vm.hasImage && !this.vm.hasText && !this.vm.hasLink) {
      img = this.imgPostElRef.nativeElement;
      console.log(img.src);

      this.toBlob(img.src, this.vm.title)
        .subscribe(imgFile => {
          if (this.nav.canShare && this.nav.canShare({ files: [imgFile] })) {
            this.nav.share({
              files: [imgFile],
              title: this.vm.title,
              text: this.vm.title,
            });

            return;
          }
        });
    } */

    if (this.nav.share) {
      this.nav.share({
        title: this.vm.title,
        text: this.vm.title,
        url: this.vm.url,
      });
    }

    /* if (navigator.canShare && navigator.canShare({ files: filesArray })) {
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

  toBlob(src: string, name: string) {
    const img = new Image();

    const compress$ = fromEvent(img, 'load').pipe(
      switchMap(_ => {
        window.URL.revokeObjectURL(img.src);

        const canvas = document.createElement('canvas');
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;

        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        return new Observable<File>(observer => {
          canvas.toBlob(x => {
            const result = new File(
              [x],
              name
            );

            observer.next(result);
            observer.complete();
          });
        });
      })
    );

    img.src = src;

    return compress$;
  }
}
