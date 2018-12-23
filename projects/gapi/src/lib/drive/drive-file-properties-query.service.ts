import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper, Result } from 'core';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DriveFile } from './drive-file';

@Injectable({ providedIn: 'root' })
export class DriveFilePropertiesQuery {
  constructor(
    private http: HttpClient
  ) { }

  execute(fileId: string) {
    if (String.isNullOrWhitespace(fileId)) {
      return throwError(Result.CreateErrorResult('Required', 'fileId'));
    }

    const httpParams = new HttpParams()
      .append('fields', DriveFile.fields);

    return this.http.get(`${DriveFile.metadataURI}/${fileId}`, { params: httpParams }).pipe(
      map(x => DomainHelper.adapt(DriveFile, x))
    );
  }
}
