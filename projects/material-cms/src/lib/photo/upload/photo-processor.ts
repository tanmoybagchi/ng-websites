import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export interface PhotoProcessor {
  process(file: File): Observable<PhotoProcessor.Result[]>;
}

export namespace PhotoProcessor {
  export class Result {
    width: number;
    height: number;
    file: File;
  }
}

export const PHOTO_PROCESSOR = new InjectionToken<PhotoProcessor>('PhotoProcessor');
