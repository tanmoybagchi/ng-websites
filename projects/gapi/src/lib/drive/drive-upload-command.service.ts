import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { map, switchMap } from 'rxjs/operators';
import { DriveFileSearchQuery } from './drive-file-search-query.service';
import { DriveMimeTypes } from './drive-mime-types';
import { DriveFile } from './drive-file';

@Injectable({ providedIn: 'root' })
export class DriveUploadCommand {
  constructor(
    private http: HttpClient,
    private driveFileSearchQuery: DriveFileSearchQuery
  ) { }

  execute(file: File, path?: string, mimeType?: DriveMimeTypes) {
    if (String.isNullOrWhitespace(path)) {
      return this.uploadFile(file, undefined, mimeType);
    }

    return this.driveFileSearchQuery.execute(path, undefined, true).pipe(
      switchMap(qr => this.uploadFile(file, qr[0].id, mimeType))
    );
  }

  private uploadFile(file: File, parentId?: string, mimeType?: DriveMimeTypes) {
    const extensionIndex = file.name.lastIndexOf('.');

    const driveFileResource = {
      name: file.name.slice(0, extensionIndex),
      mimeType: mimeType || file.type
    };

    // tslint:disable-next-line:no-unused-expression
    String.hasData(parentId) && ((driveFileResource as any).parents = [parentId]);

    const httpParams = new HttpParams()
      .append('uploadType', 'media')
      .append('fields', DriveFile.fields);

    return this.http.post(DriveFile.metadataURI, driveFileResource).pipe(
      switchMap((_: any) => this.http.patch(`${DriveFile.uploadURI}/${_.id}`, file, { params: httpParams }).pipe(
        map(x => DomainHelper.adapt(DriveFile, x))
      ))
    );
  }
}
