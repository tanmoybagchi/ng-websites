import { Injectable } from '@angular/core';
import { fromEvent, Observable, zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Photo } from '../photo';
import { PhotoProcessor } from './photo-processor';

@Injectable({ providedIn: 'root' })
export class CanvasPhotoProcessor implements PhotoProcessor {
  private readonly mimeType = 'image/jpeg';

  process(file: File) {
    const img = new Image();
    img.src = window.URL.createObjectURL(file);

    return fromEvent(img, 'load').pipe(
      switchMap(_ => {
        window.URL.revokeObjectURL(img.src);

        const resizers$: Observable<PhotoProcessor.Result>[] = [];
        const aspect_ratio = img.width / img.height;

        Photo.SIZES.forEach(item => {
          let width = 0;
          let height = 0;

          if (item.dimension === -1) {
            width = img.width;
            height = img.height;
          } else {
            if (img.height > img.width) {
              width = item.dimension;
              height = Math.round(width / aspect_ratio);
            } else {
              height = item.dimension;
              width = Math.round(height * aspect_ratio);
            }
          }

          if (height > img.height || width > img.width) {
            return;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const context = canvas.getContext('2d');
          context.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);

          const resizer$ = new Observable<PhotoProcessor.Result>(observer => {
            canvas.toBlob(x => {
              const result = new PhotoProcessor.Result();

              const fileNameParts = file.name.split('.');
              fileNameParts.pop();

              const fileName = item.name === 'Original' ?
                `${fileNameParts.join('.')}.jpg`
                : `${fileNameParts.join('.')}-${item.name}.jpg`;

              result.file = new File(
                [x],
                fileName,
                { lastModified: file.lastModified, type: this.mimeType }
              );
              result.height = height;
              result.width = width;

              observer.next(result);
              observer.complete();
            }, this.mimeType);
          });

          resizers$.push(resizer$);
        });

        return zip(...resizers$);
      })
    );
  }
}
