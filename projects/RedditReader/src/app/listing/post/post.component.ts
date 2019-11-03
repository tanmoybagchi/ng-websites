import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Thing } from '@app/domain/models';
import { environment } from '@env/environment';
import { fromEvent, Observable, range } from 'rxjs';
import { finalize, switchMap, tap, map } from 'rxjs/operators';
import { PostViewModel } from './post-view-model';

@Component({
  selector: 'rr-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent {
  vm: PostViewModel;
  canShare: boolean;
  nav: any;
  isSharing: boolean;
  shareData: { files?: File[]; title?: string; text?: string; url?: string; };

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
    private changeDetector: ChangeDetectorRef,
  ) {
    this.nav = navigator as any;
    this.canShare = !environment.production || this.nav.share;
  }

  share() {
    if (this.shareData) {
      this.nav.share(this.shareData);
      return;
    }

    if (this.imgPostElRef && this.vm.hasImage && !this.vm.hasText && !this.vm.hasLink) {
      const img: HTMLImageElement = this.imgPostElRef.nativeElement;

      this.isSharing = true;
      this.changeDetector.detectChanges();

      this.imgToFile(img.src, 'share.png').pipe(
        tap(imgFile => {
          const sD = {
            files: [imgFile],
            title: this.vm.title,
            text: this.vm.title,
          };

          if (this.nav.canShare && this.nav.canShare(sD)) {
            this.shareData = sD;
            this.nav.share(this.shareData);
          }

          this.isSharing = false;
          this.changeDetector.detectChanges();
        }),
        finalize(() => this.isSharing = false)
      ).subscribe();
    }

    if (this.nav.share && this.vm.hasText && !this.vm.hasImage && !this.vm.hasLink) {
      this.shareData = {
        title: this.vm.title,
        text: `${this.vm.title}\n${this.vm.plainText}`
      };

      this.nav.share(this.shareData);
    }

    if (this.nav.share && !this.vm.hasText && !this.vm.hasImage && this.vm.hasLink) {
      this.shareData = {
        title: this.vm.title,
        url: this.vm.url,
      };

      this.nav.share(this.shareData);
    }
  }

  imgToFile(imgSrc: string, fileName: string) {
    const img = new Image();

    const imgToFile$ = fromEvent(img, 'load').pipe(
      switchMap(_ => {
        const canvas = document.createElement('canvas');
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;

        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        return new Observable<File>(observer => {
          canvas.toBlob(x => {
            const result = new File(
              [x],
              fileName,
              { type: x.type }
            );

            observer.next(result);
            observer.complete();
          });
        });
      })
    );

    img.crossOrigin = 'anonymous';
    img.src = `https://cors-anywhere.herokuapp.com/${imgSrc}`;

    return imgToFile$;
  }
}
