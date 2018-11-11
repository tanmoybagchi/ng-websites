import { Injectable } from '@angular/core';
import { fromEvent, Observable, zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AdminModule } from '../admin.module';

@Injectable({
  providedIn: AdminModule
})
export class AdminPhotoProcessCommand {
  private readonly mimeType = 'image/jpeg';
  private readonly sizes = [
    { name: 'Original', size: -1 },
    { name: 'Thumbnail_Small', size: 128 },
    { name: 'Thumbnail_Big', size: 256 },
    { name: 'Size_XS', size: 599 },
    { name: 'Size_SM', size: 959 },
    { name: 'Size_MD', size: 1279 },
    { name: 'Size_LG', size: 1919 },
  ];

  constructor() { }

  execute(file: File) {
    const img = new Image();
    img.src = window.URL.createObjectURL(file);

    return fromEvent(img, 'load').pipe(
      switchMap(_ => {
        window.URL.revokeObjectURL(img.src);

        const resizers$: Observable<AdminPhotoProcessCommand.Result>[] = [];
        const aspect_ratio = img.width / img.height;

        this.sizes.forEach(item => {
          let width = 0;
          let height = 0;

          if (item.size === -1) {
            width = img.width;
            height = img.height;
          } else {
            if (img.height > img.width) {
              width = item.size;
              height = Math.round(width / aspect_ratio);
            } else {
              height = item.size;
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

          const resizer$ = new Observable<AdminPhotoProcessCommand.Result>(observer => {
            canvas.toBlob(x => {
              const result = new AdminPhotoProcessCommand.Result();

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

export namespace AdminPhotoProcessCommand {
  export class Result {
    width: number;
    height: number;
    file: File;
  }
}
