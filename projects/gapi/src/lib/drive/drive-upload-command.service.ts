import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { DriveMimeTypes } from './drive-mime-types';

@Injectable({ providedIn: 'root' })
export class DriveUploadCommand {
  constructor(
    private http: HttpClient
  ) { }

  execute(file: File, mimeType?: DriveMimeTypes) {
    const extensionIndex = file.name.lastIndexOf('.');

    const driveFileResource = {
      name: file.name.slice(0, extensionIndex),
      mimeType: mimeType || file.type
    };

    // tslint:disable-next-line:max-line-length
    return this.http.post('https://www.googleapis.com/drive/v3/files', driveFileResource).pipe(
      switchMap((_: any) => this.http.patch(`https://www.googleapis.com/upload/drive/v3/files/${_.id}?uploadType=media`, file))
    );
  }
}
