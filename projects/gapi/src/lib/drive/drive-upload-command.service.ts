import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DriveUploadCommand {
  constructor(
    private http: HttpClient
  ) { }

  execute(file: File) {
    const extensionIndex = file.name.lastIndexOf('.');

    const driveFileResource = {
      name: file.name.slice(0, extensionIndex),
      mimeType: 'application/vnd.google-apps.spreadsheet'
    };

    // tslint:disable-next-line:max-line-length
    return this.http.post('https://www.googleapis.com/drive/v3/files', driveFileResource).pipe(
      switchMap((_: any) => this.http.patch(`https://www.googleapis.com/upload/drive/v3/files/${_.id}?uploadType=media`, file))
    );
  }
}
