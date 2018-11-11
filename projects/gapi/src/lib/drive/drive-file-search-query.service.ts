import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper, SessionStorageService } from 'core';
import { Observable, of, OperatorFunction } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ServiceAccountSignin } from '../auth/service-account-signin-command.service';
import { DriveFile } from './drive-file';
import { DriveMimeTypes } from './drive-mime-types';

@Injectable({ providedIn: 'root' })
export class DriveFileSearchQuery {
  private data: { name: string, parents: string, result: DriveFile[] }[] = [];
  private readonly storageKey = 'drive_items';

  constructor(
    private http: HttpClient,
    private storage: SessionStorageService,
  ) {
    this.data = this.storage.get(this.storageKey) || [];
  }

  @ServiceAccountSignin()
  execute(path?: string, mimeType?: DriveMimeTypes, cacheResults?: boolean) {
    if (String.isNullOrWhitespace(path)) {
      return this.searchDrive(path, undefined, mimeType, cacheResults);
    }

    const pathParts = path.split('\\');

    if (pathParts.length === 1) {
      return this.searchDrive(pathParts[0], undefined, mimeType, cacheResults);
    }

    const rootFolder$ = this.searchDrive(pathParts[0], undefined, DriveMimeTypes.Folder, true);

    const pathToFile$: OperatorFunction<DriveFile[], DriveFile[]>[] = [];

    for (let index = 1; index < pathParts.length - 1; index++) {
      const element = pathParts[index];
      pathToFile$.push(switchMap(qr => this.searchDrive(element, qr[0].id, DriveMimeTypes.Folder, true)));
    }

    pathToFile$.push(switchMap(qr => this.searchDrive(pathParts[pathParts.length - 1], qr[0].id, mimeType, cacheResults)));

    return (rootFolder$.pipe.call(rootFolder$, ...pathToFile$) as Observable<DriveFile[]>);
  }

  private searchDrive(name?: string, parents?: string, mimeType?: string, cacheResults?: boolean) {
    if (String.hasData(name) && cacheResults) {
      const item = this.data.find(x => x.name === name && x.parents === parents);
      if (item) {
        return of(item.result);
      }
    }

    const searchParams: string[] = [];
    // tslint:disable-next-line:no-unused-expression
    String.hasData(name) && searchParams.push(`name='${name}'`);
    // tslint:disable-next-line:no-unused-expression
    String.hasData(mimeType) && searchParams.push(`mimeType = '${mimeType}'`);
    // tslint:disable-next-line:no-unused-expression
    String.hasData(parents) && searchParams.push(`'${parents}' in parents`);
    searchParams.push(`trashed=false`);

    const httpParams = new HttpParams()
      .append('q', searchParams.join(' and '))
      .append('fields', `files(${DriveFile.fields})`);

    return this.http.get(DriveFile.metadataURI, { params: httpParams }).pipe(
      map((x: { files: any[]; }) => x.files.map(f => DomainHelper.adapt(DriveFile, f))),
      tap(qr => {
        if (String.hasData(name) && cacheResults && qr.length > 0) {
          this.data.push({ name, parents, result: qr });
          this.storage.set(this.storageKey, this.data);
        }
      })
    );
  }
}
