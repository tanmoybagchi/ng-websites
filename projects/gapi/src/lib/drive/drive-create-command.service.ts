import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper, Result } from 'core';
import { throwError, iif } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DriveFile } from './drive-file';
import { DriveMimeTypes } from './drive-mime-types';
import { DriveFileSearchQuery } from './drive-file-search-query.service';

@Injectable({ providedIn: 'root' })
export class DriveCreateCommand {
  constructor(
    private http: HttpClient,
    private driveFileSearchQuery: DriveFileSearchQuery
  ) { }

  execute(filePath: string, mimeType?: DriveMimeTypes) {
    if (String.isNullOrWhitespace(filePath)) {
      return throwError(Result.CreateErrorResult('Required', 'filePath'));
    }

    const pathParts = filePath.split('\\');

    if (pathParts.length === 1) {
      return this.createFile(filePath, mimeType, undefined);
    }

    const filename = pathParts.pop();

    return this.driveFileSearchQuery.execute(pathParts.join('\\'), undefined, true).pipe(
      switchMap(qr => this.createFile(filename, mimeType, qr[0].id))
    );
  }

  private createFile(fileName: string, mimeType?: DriveMimeTypes, parents?: string) {
    const body: { name: string, mimeType?: DriveMimeTypes, parents?: string[] } = { name: fileName };

    // tslint:disable-next-line:no-unused-expression
    mimeType && (body.mimeType = mimeType);
    // tslint:disable-next-line:no-unused-expression
    String.hasData(parents) && (body.parents = [parents]);

    const httpParams = new HttpParams()
      .append('fields', DriveFile.fields);

    return this.http.post(DriveFile.metadataURI, body, { params: httpParams }).pipe(
      map(_ => DomainHelper.adapt(DriveFile, _))
    );
  }
}
