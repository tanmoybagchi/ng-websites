import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Thing } from '@app/domain/models';
import { environment } from '@env/environment';
import { fromEvent, Observable } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { PostViewModel } from './post-view-model';

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
  isSharing: boolean;
  canShareImage = false;
  files: FileList;

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
    this.canShare = !environment.production || this.nav.share || this.nav.canShare;
  }

  ngOnInit() {
  }

  share() {
    if (this.imgPostElRef && this.vm.hasImage && !this.vm.hasText && !this.vm.hasLink) {
      this.isSharing = true;
      this.changeDetector.detectChanges();

      const img: HTMLImageElement = this.imgPostElRef.nativeElement;

      this.toBlob(img.src, this.vm.title).pipe(
        tap(imgFile => {
          const tan = new DataTransfer();
          tan.items.add(imgFile);

          this.files = tan.files;
          this.isSharing = false;
          this.canShareImage = true;
          this.changeDetector.detectChanges();
        }),
        finalize(() => this.isSharing = false)
      ).subscribe();
    }

    if (this.nav.share && this.vm.hasText && !this.vm.hasImage && !this.vm.hasLink) {
      this.nav.share({
        title: this.vm.title,
        text: `${this.vm.title}\n${this.vm.plainText}`
      });
    }

    if (this.nav.share && !this.vm.hasText && !this.vm.hasImage && this.vm.hasLink) {
      this.nav.share({
        title: this.vm.title,
        url: this.vm.url,
      });
    }
  }

  shareImage() {
    const shareData = {
      files: this.files,
      title: this.vm.title,
      text: this.vm.title,
    };

    // tslint:disable-next-line:no-unused-expression
    this.nav.canShare && this.nav.canShare(shareData) && this.nav.share(shareData).catch(error => window.alert(error));
  }

  toBlob(src: string, name: string) {
    const img = new Image();

    const toBlob$ = fromEvent(img, 'load').pipe(
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
              name,
              { type: x.type }
            );

            observer.next(result);
            observer.complete();
          });
        });
      })
    );

    img.crossOrigin = 'anonymous';
    img.src = `https://cors-anywhere.herokuapp.com/${src}`;

    return toBlob$;
  }
}
