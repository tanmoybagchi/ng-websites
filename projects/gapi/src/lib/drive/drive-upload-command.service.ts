import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { map, switchMap } from 'rxjs/operators';
import { DriveMimeTypes } from './drive-mime-types';

@Injectable({ providedIn: 'root' })
export class DriveUploadCommand {
  constructor(
    private http: HttpClient
  ) { }

  execute(file: File, parentId?: string, mimeType?: DriveMimeTypes) {
    const extensionIndex = file.name.lastIndexOf('.');

    const driveFileResource = {
      name: file.name.slice(0, extensionIndex),
      mimeType: mimeType || file.type
    };

    // tslint:disable-next-line:no-unused-expression
    String.hasData(parentId) && ((driveFileResource as any).parents = [parentId]);

    const httpParams = new HttpParams()
      .append('uploadType', 'media')
      .append('fields', 'id,webContentLink,name');

      // tslint:disable-next-line:max-line-length
    return this.http.post('https://www.googleapis.com/drive/v3/files', driveFileResource).pipe(
      // tslint:disable-next-line:max-line-length
      switchMap((_: any) => this.http.patch(`https://www.googleapis.com/upload/drive/v3/files/${_.id}?uploadType=media`, file, { params: httpParams }).pipe(
        map(x => DomainHelper.adapt(DriveUploadCommand.Result, x))
      ))
    );
  }
}

export namespace DriveUploadCommand {
  export class Result {
    id = '';
    webContentLink = '';
    name = '';
  }
}
