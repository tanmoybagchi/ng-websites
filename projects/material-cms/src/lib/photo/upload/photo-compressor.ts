import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export interface PhotoCompressor {
  compress(file: File): Observable<PhotoCompressor.Result>;
}

export namespace PhotoCompressor {
  export class Result {
    width: number;
    height: number;
    file: File;
  }
}

export const PHOTO_COMPRESSOR = new InjectionToken<PhotoCompressor>('PhotoCompressor');
