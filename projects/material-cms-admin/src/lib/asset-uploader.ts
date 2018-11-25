import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface AssetUploader {
  uploadPhoto(photo: File): Observable<AssetUploader.Result>;
  uploadDocument(doc: File): Observable<AssetUploader.Result>;
  uploadAudio(audio: File): Observable<AssetUploader.Result>;
}

export namespace AssetUploader {
  export class Result {
    fileName: string;
    location: string;
  }
}

export const ASSET_UPLOADER = new InjectionToken<AssetUploader>('AssetUploader');
