import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper, Result } from 'core';
import { throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DriveMimeTypes } from './drive-mime-types';
import { DriveCreateCommand } from './drive-create-command.service';

@Injectable({ providedIn: 'root' })
export class DriveFileSaveCommand {
  constructor(
    private http: HttpClient,
    private createCommand: DriveCreateCommand
  ) { }

  execute(fileContent: any, fileId?: string, fileName?: string, mimeType?: DriveMimeTypes) {
    if (fileContent === undefined || fileContent === null) {
      return throwError(Result.CreateErrorResult('Required', 'fileContent'));
    }

    if (String.hasData(fileId)) {
      return this.upload(fileContent, fileId);
    }

    return this.createCommand.execute(fileName, mimeType).pipe(
      switchMap(_ => this.upload(fileContent, _.id))
    );
  }

  private upload(fileContent: any, fileId: string) {
    const httpParams = new HttpParams()
      .append('uploadType', 'media')
      .append('fields', 'id,name,modifiedTime,version');

    const uploadBaseUrl = `https://www.googleapis.com/upload/drive/v3/files`;

    return this.http.patch(`${uploadBaseUrl}/${fileId}`, fileContent, { params: httpParams }).pipe(
      map(x => DomainHelper.adapt(DriveFileSaveCommand.Result, x))
    );
  }
}

export namespace DriveFileSaveCommand {
  // tslint:disable-next-line:no-shadowed-variable
  export class Result {
    id = '';
    name = '';
    @Reflect.metadata('design:type', Date)
    modifiedTime: Date = null;
    version = 0;
  }
}
