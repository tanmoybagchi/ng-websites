import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PhotoCompressor } from 'material-cms-admin';

@Injectable({ providedIn: 'root' })
export class CanvasPhotoCompressor implements PhotoCompressor {
  private readonly mimeType = 'image/jpeg';

  compress(file: File) {
    const img = new Image();

    const compress$ = fromEvent(img, 'load').pipe(
      switchMap(_ => {
        window.URL.revokeObjectURL(img.src);

        const canvas = document.createElement('canvas');
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;

        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        return new Observable<PhotoCompressor.Result>(observer => {
          canvas.toBlob(x => {
            const result = new PhotoCompressor.Result();

            result.file = new File(
              [x],
              file.name,
              { lastModified: file.lastModified, type: this.mimeType }
            );
            result.height = img.naturalHeight;
            result.width = img.naturalWidth;

            observer.next(result);
            observer.complete();
          }, this.mimeType);
        });
      })
    );

    img.src = window.URL.createObjectURL(file);

    return compress$;
  }
}
