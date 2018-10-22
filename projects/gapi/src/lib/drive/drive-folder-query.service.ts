import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService, Result } from 'core';
import { Observable, of, throwError } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DriveFolderQuery {
  private data: { name: string, parentId: string, id: string }[];
  private observable: Observable<any>;
  private initializing = false;

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
  ) {
    this.data = this.storage.get('folders') || [];
  }

  execute(name: string, parentId: string = null) {
    if (String.isNullOrWhitespace(name)) {
      return throwError(Result.CreateErrorResult('Required', 'name'));
    }

    const folder = this.data.find(x => x.name === name && x.parentId === parentId);
    if (folder) {
      return of(folder.id);
    }

    this.initialize(name, parentId);

    return this.observable.pipe(
      map(() => {
        const item = this.data.find(x => x.name === name && x.parentId === parentId);
        return item ? item.id : '';
      })
    );
  }

  private initialize(name: string, parentId: string = null) {
    if (this.initializing) {
      return;
    }

    this.initializing = true;

    this.observable = this.getFolderId(name, parentId).pipe(
      tap((x: { files: { id: string }[] }) => {
        this.data.push({ name, parentId, id: x.files[0].id });

        // when the cached data is available we don't need the 'Observable' reference anymore
        this.observable = null;

        this.initializing = false;

        this.storage.set('folders', this.data);
      }),
      share()
    );
  }

  private getFolderId(name: string, parentId: string) {
    const searchParams: string[] = [];
    searchParams.push(`name='${name}'`);
    searchParams.push('mimeType = \'application/vnd.google-apps.folder\'');
    searchParams.push(`trashed=false`);

    if (String.hasData(parentId)) {
      searchParams.push(`'${parentId}' in parents`);
    }

    const queryParams = {
      q: searchParams.join(' and '),
      fields: 'files(id)'
    };

    const httpParams = new HttpParams({ fromObject: queryParams });
    const url = 'https://www.googleapis.com/drive/v3/files';

    const options = {
      params: httpParams,
    };

    return this.http.get(url, options);
  }
}
