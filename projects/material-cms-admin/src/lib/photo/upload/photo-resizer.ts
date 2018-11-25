import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export interface PhotoResizer {
  // tslint:disable-next-line:max-line-length
  resize(photo: { width: number; height: number; file: File; }, newSize: { name: string, dimension: number }): Observable<PhotoResizer.Result>;
}

export namespace PhotoResizer {
  export class Result {
    width: number;
    height: number;
    file: File;
  }
}

export const PHOTO_RESIZER = new InjectionToken<PhotoResizer>('PhotoResizer');
