import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Thing } from '@app/domain/models';
import { environment } from '@env/environment';
import { fromEvent, Observable } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { PostViewModel } from './post-view-model';
// import * as shaka from 'shaka-player';

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
  imagePreparationTookTooLong = false;
  shareData: { files?: File[]; title?: string; text?: string; url?: string; };
  imagePreparationStartedOn: number;
  dialogRef: any;

  player: any;
  playBound: any;

  @Input()
  public set post(v: Thing) {
    this.vm = new PostViewModel(v, this.sanitizer);
    setTimeout(() => {
      this.changeDetector.markForCheck();
    }, 0);
  }

  @ViewChild('imgPost', { static: false })
  imgPostElRef: ElementRef;

  @ViewChild('preparingImage', { static: false })
  preparingImageTmplRef: any;

  /* private vdoPost: HTMLVideoElement;
  @ViewChild('vdoPost', { static: false })
  public set value(v: ElementRef) {
    if (v && v.nativeElement) {
      if (!this.vm.videoSrcs.some(s => s.type === 'application/dash+xml')) {
        return;
      }

      this.vdoPost = v.nativeElement;
      this.playBound = this.play.bind(this);
      this.vdoPost.addEventListener('play', this.playBound);
    }
  } */

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
  ) {
    this.nav = navigator as any;
    this.canShare = !environment.production || this.nav.share;
  }

  /* play($event: Event) {
    this.vdoPost.removeEventListener('play', this.playBound);

    this.vdoPost.pause();

    // tslint:disable-next-line:max-line-length
    const manifestUri = `https://cors.indytan.workers.dev/${this.vm.videoSrcs.filter(s => s.type === 'application/dash+xml')[0].url}`;
    // tslint:disable-next-line:max-line-length
    // const manifestUri = `https://cors-anywhere.herokuapp.com/${encodeURIComponent(this.vm.videoSrcs.filter(s => s.type === 'application/dash+xml')[0].url)}`;

    this.player = new shaka.Player(this.vdoPost);

    this.player.load(manifestUri).then(() => {
      this.vdoPost.muted = true;
      this.vdoPost.play();
    });
  } */

  share() {
    if (this.shareData) {
      if (this.nav.share) {
        this.nav.share(this.shareData);
      } else if (!environment.production) {
        console.log(this.shareData);
      }

      return;
    }

    if (this.vm.onlyImage()) {
      this.shareImage();
      return;
    }

    this.shareData = {
      text: `${this.vm.title}${String.hasData(this.vm.plainText) ? `\n\n${this.vm.plainText}` : ''}`,
    };

    if (!this.vm.onlyText()) {
      this.shareData.url = this.vm.url;
    }

    if (this.nav.share) {
      this.nav.share(this.shareData);
    } else if (!environment.production) {
      console.log(this.shareData);
    }
  }

  shareImage() {
    const img: HTMLImageElement = this.imgPostElRef.nativeElement;

    this.imagePreparationStartedOn = Date.now();

    setTimeout(() => {
      if (this.isSharing) {
        this.dialogRef = this.dialog.open(this.preparingImageTmplRef, { closeOnNavigation: true, disableClose: true });
      }
    }, 1000);

    this.isSharing = true;
    this.changeDetector.detectChanges();

    this.imgToFile(img.src, 'share.png').pipe(
      tap(imgFile => {
        const sD = {
          files: [imgFile],
          text: this.vm.title,
        };

        if (!environment.production || (this.nav.canShare && this.nav.canShare(sD))) {
          this.shareData = sD;
        }

        if (this.imagePreparedInTime()) {
          if (this.dialogRef) {
            this.dialogRef.close();
            this.changeDetector.detectChanges();
          }

          if (this.nav.share) {
            this.nav.share(this.shareData);
          } else if (!environment.production) {
            console.log(this.shareData);
          }
        } else {
          this.imagePreparationTookTooLong = true;
          this.dialogRef.afterClosed().subscribe(_ => this.share());
        }

        this.isSharing = false;
        this.changeDetector.detectChanges();
      }),
      finalize(() => this.isSharing = false)
    ).subscribe();
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
    img.src = `https://cors.indytan.workers.dev/${imgSrc}`;

    return imgToFile$;
  }

  imagePreparedInTime() {
    return Date.now() - this.imagePreparationStartedOn <= 3000;
  }
}
