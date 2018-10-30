import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper, SessionStorageService, Result } from 'core';
import { of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DriveMimeTypes } from './drive-mime-types';

@Injectable({ providedIn: 'root' })
export class DriveFileSearchQuery {
  private data: { name: string, parents: string, result: DriveFileSearchQuery.Result[] }[] = [];
  private readonly storageKey = 'drive_items';

  constructor(
    private http: HttpClient,
    private storage: SessionStorageService,
  ) {
    this.data = this.storage.get(this.storageKey) || [];
  }

  execute(name: string, parents?: string, mimeType?: DriveMimeTypes, cacheResults?: boolean) {
    if (String.isNullOrWhitespace(name)) {
      return throwError(Result.CreateErrorResult('Required', 'name'));
    }

    if (cacheResults) {
      const item = this.data.find(x => x.name === name && x.parents === parents);
      if (item) {
        return of(item.result);
      }
    }

    return this.searchDrive(name, parents, mimeType).pipe(
      map((x: { files: any[] }) => x.files.map(f => DomainHelper.adapt(DriveFileSearchQuery.Result, f))),
      tap(result => {
        if (cacheResults && result.length > 0) {
          this.data.push({ name, parents, result });
          this.storage.set(this.storageKey, this.data);
        }
      }),
    );
  }

  private searchDrive(name: string, parents: string, mimeType: string) {
    const searchParams: string[] = [];
    searchParams.push(`name='${name}'`);
    // tslint:disable-next-line:no-unused-expression
    String.hasData(mimeType) && searchParams.push(`mimeType = '${mimeType}'`);
    // tslint:disable-next-line:no-unused-expression
    String.hasData(parents) && searchParams.push(`'${parents}' in parents`);
    searchParams.push(`trashed=false`);

    const httpParams = new HttpParams()
      .append('q', searchParams.join(' and '))
      .append('fields', 'files(id,name,modifiedTime,version)');

    const url = 'https://www.googleapis.com/drive/v3/files';

    return this.http.get(url, { params: httpParams });
  }
}

export namespace DriveFileSearchQuery {
  // tslint:disable-next-line:no-shadowed-variable
  export class Result {
    id = '';
    name = '';
    @Reflect.metadata('design:type', Date)
    modifiedTime: Date = null;
    version = 0;
  }
}
