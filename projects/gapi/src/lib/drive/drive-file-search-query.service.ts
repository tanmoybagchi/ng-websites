import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper, LocalStorageService, Result } from 'core';
import { Observable, of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DriveFileSearchQuery {
  private data: { name: string, parents: string, result: DriveFileSearchQuery.Result[] }[] = [];
  private initializing = false;
  private observable: Observable<DriveFileSearchQuery.Result[]>;
  private readonly storageKey = 'drive_items';

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
  ) {
    this.data = this.storage.get(this.storageKey) || [];
  }

  execute(name: string, parents: string, mimeType = '', cacheResults = false) {
    if (String.isNullOrWhitespace(name)) {
      return throwError(Result.CreateErrorResult('Required', 'name'));
    }

    if (cacheResults) {
      const item = this.data.find(x => x.name === name);
      if (item) {
        return of(item.result);
      }
    }

    this.executeInternal(name, parents, mimeType, cacheResults);

    return this.observable.pipe(
      map(() => {
        const item = this.data.find(x => x.name === name && x.parents === parents);
        return item ? item.result : [];
      })
    );
  }

  private executeInternal(name: string, parents: string, mimeType: string, cacheResults: boolean) {
    if (this.initializing) {
      return;
    }

    this.initializing = true;
    this.data = null;

    this.observable = this.searchDrive(name, parents, mimeType).pipe(
      map((x: { files: any[] }) => x.files.map(f => DomainHelper.adapt(DriveFileSearchQuery.Result, f))),
      tap(result => {
        this.data.push({ name, parents, result });

        // when the cached data is available we don't need the 'Observable' reference anymore
        this.observable = null;

        this.initializing = false;

        cacheResults && this.storage.set(this.storageKey, this.data);
      }),
    );
  }

  private searchDrive(name: string, parents: string, mimeType = '') {
    const searchParams: string[] = [];
    searchParams.push(`name='${name}'`);
    String.hasData(mimeType) && searchParams.push('mimeType = \'application/vnd.google-apps.folder\'');
    String.hasData(parents) && searchParams.push(`'${parents}' in parents`);
    searchParams.push(`trashed=false`);

    const queryParams = {
      q: searchParams.join(' and '),
      fields: 'files(id,name,modifiedTime,version)'
    };

    const httpParams = new HttpParams({ fromObject: queryParams });
    const url = 'https://www.googleapis.com/drive/v3/files';

    const options = {
      params: httpParams,
    };

    return this.http.get(url, options);
  }
}

export namespace DriveFileSearchQuery {
  export class Result {
    id = '';
    name = '';
    @Reflect.metadata('design:type', Date)
    modifiedTime: Date = null;
    version = 0;
  }
}
