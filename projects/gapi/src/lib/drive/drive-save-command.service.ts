import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper, Result } from 'core';
import { throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DriveMimeTypes } from './drive-mime-types';

@Injectable({ providedIn: 'root' })
export class DriveSaveCommand {
  constructor(
    private http: HttpClient
  ) { }

  execute(fileContent: any, fileId?: string, fileName?: string, mimeType?: DriveMimeTypes.File) {
    if (fileContent === undefined || fileContent === null) {
      return throwError(Result.CreateErrorResult('Required', 'fileContent'));
    }

    if (String.isNullOrWhitespace(fileId) && String.isNullOrWhitespace(fileName)) {
      return throwError(Result.CreateErrorResult('Must specify fileId or fileName'));
    }

    if (String.hasData(fileId)) {
      return this.upload(fileContent, fileId);
    }

    return this.create(fileName, mimeType).pipe(
      switchMap((_: any) => this.upload(fileContent, _.id))
    );
  }

  private create(fileName: string, mimeType?: DriveMimeTypes) {
    let body = { name: fileName};
    if (mimeType) {
      (body as any).mimeType = mimeType
    }

    return this.http.post('https://www.googleapis.com/drive/v3/files', body);
  }

  private upload(fileContent: any, fileId: string) {
    const httpParams = new HttpParams()
      .append('uploadType', 'media')
      .append('fields', 'id,name,modifiedTime,version');

    const uploadBaseUrl = `https://www.googleapis.com/upload/drive/v3/files`;

    return this.http.patch(`${uploadBaseUrl}/${fileId}`, fileContent, { params: httpParams }).pipe(
      map(x => DomainHelper.adapt(DriveSaveCommand.Result, x))
    );
  }
}

export namespace DriveSaveCommand {
  export class Result {
    id = '';
    name = '';
    @Reflect.metadata('design:type', Date)
    modifiedTime: Date = null;
    version = 0;
  }
}
