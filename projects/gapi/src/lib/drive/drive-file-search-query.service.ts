import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper, LocalStorageService } from 'core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DriveFileSearchQuery {
  private data: { name: string, result: DriveFileSearchQuery.Result[] }[] = [];
  private observable: Observable<any>;
  private initializing = false;

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
  ) {
  }

  execute(name = '', parents: string[] = [], mimeType = '') {
    if (String.hasData(name)) {
      const item = this.data.find(x => x.name === name);
      if (item) {
        return of(item.result);
      }
    }

    const searchParams: string[] = [];

    if (String.hasData(name)) {
      searchParams.push(`name='${name}'`);
    }

    if (String.hasData(mimeType)) {
      searchParams.push(`mimeType=${mimeType}`);
    }

    if (parents.length > 0) {
      searchParams.push(`'${parents.join(',')}' in parents`);
    }

    searchParams.push(`trashed=false`);

    const queryParams = {
      q: searchParams.join(' and '),
      fields: 'files(id,name,modifiedTime,version)'
    };

    const httpParams = new HttpParams({ fromObject: queryParams });
    const url = 'https://www.googleapis.com/drive/v3/files';

    const options = {
      params: httpParams
    };

    return this.http.get(url, options).pipe(
      map((x: { files: any[] }) => x.files.map(f => DomainHelper.adapt(DriveFileSearchQuery.Result, f))),
      tap(result => this.data.push({ name, result }))
    );
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
