import { Injectable } from '@angular/core';
import { fromEvent, Observable, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PhotoResizer } from './photo-resizer';

@Injectable({ providedIn: 'root' })
export class CanvasPhotoResizer implements PhotoResizer {
  private readonly mimeType = 'image/jpeg';

  resize(photo: { width: number; height: number; file: File; }, newSize: { name: string, dimension: number }) {
    const img = new Image();

    const res$ = fromEvent(img, 'load').pipe(
      switchMap(_ => {
        window.URL.revokeObjectURL(img.src);

        const result = new PhotoResizer.Result();

        const aspect_ratio = img.naturalWidth / img.naturalHeight;

        let width = 0;
        let height = 0;

        if (newSize.dimension === -1) {
          width = img.naturalWidth;
          height = img.naturalHeight;
        } else if (img.naturalHeight > img.naturalWidth) {
          width = newSize.dimension;
          height = Math.round(width / aspect_ratio);
        } else {
          height = newSize.dimension;
          width = Math.round(height * aspect_ratio);
        }

        if (height > img.naturalHeight || width > img.naturalWidth) {
          return EMPTY;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, width, height);

        return new Observable<PhotoResizer.Result>(observer => {
          canvas.toBlob(x => {
            const fileNameParts = photo.file.name.split('.');
            fileNameParts.pop();

            const fileName = newSize.name === 'Original' ?
              `${fileNameParts.join('.')}.jpg`
              : `${fileNameParts.join('.')}-${newSize.name}.jpg`;

            result.file = new File(
              [x],
              fileName,
              { lastModified: photo.file.lastModified, type: this.mimeType }
            );
            result.height = height;
            result.width = width;

            observer.next(result);
            observer.complete();
          }, this.mimeType, 100);
        });
      })
    );

    img.src = window.URL.createObjectURL(photo.file);

    return res$;
  }
}
