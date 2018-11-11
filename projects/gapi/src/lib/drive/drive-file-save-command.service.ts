import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper, Result } from 'core';
import { throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DriveMimeTypes } from './drive-mime-types';
import { DriveCreateCommand } from './drive-create-command.service';
import { DriveFile } from './drive-file';

@Injectable({ providedIn: 'root' })
export class DriveFileSaveCommand {
  constructor(
    private http: HttpClient,
    private createCommand: DriveCreateCommand
  ) { }

  execute(fileContent: any, fileId?: string, filePath?: string, mimeType?: DriveMimeTypes) {
    if (fileContent === undefined || fileContent === null) {
      return throwError(Result.CreateErrorResult('Required', 'fileContent'));
    }

    if (String.hasData(fileId)) {
      return this.upload(fileContent, fileId);
    }

    if (String.isNullOrWhitespace(filePath)) {
      return throwError(Result.CreateErrorResult('Required', 'filePath'));
    }

    return this.createCommand.execute(filePath, mimeType).pipe(
      switchMap(cr => this.upload(fileContent, cr.id))
    );
  }

  private upload(fileContent: any, fileId: string) {
    const httpParams = new HttpParams()
      .append('uploadType', 'media')
      .append('fields', DriveFile.fields);

    return this.http.patch(`${DriveFile.uploadURI}/${fileId}`, fileContent, { params: httpParams }).pipe(
      map(x => DomainHelper.adapt(DriveFile, x))
    );
  }
}
