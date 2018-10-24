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

  execute(name: string, parents = '', mimeType = DriveFileSearchQuery.DriveMimeTypes.File, cacheResults = false) {
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
        if (cacheResults) {
          this.data.push({ name, parents, result });
          this.storage.set(this.storageKey, this.data);
        }
      }),
    );
  }

  private searchDrive(name: string, parents: string, mimeType: string) {
    const searchParams: string[] = [];
    searchParams.push(`name='${name}'`);
    String.hasData(mimeType) && searchParams.push(`mimeType = '${mimeType}'`);
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
  export enum DriveMimeTypes {
    Audio = 'application/vnd.google-apps.audio',
    Doc = 'application/vnd.google-apps.document',
    Drawing = 'application/vnd.google-apps.drawing',
    File = 'application/vnd.google-apps.file',
    Folder = 'application/vnd.google-apps.folder',
    Form = 'application/vnd.google-apps.form',
    FusionTable = 'application/vnd.google-apps.fusiontable',
    Map = 'application/vnd.google-apps.map',
    Photo = 'application/vnd.google-apps.photo',
    Script = 'application/vnd.google-apps.script',
    Site = 'application/vnd.google-apps.site',
    Slide = 'application/vnd.google-apps.presentation',
    Spreadsheet = 'application/vnd.google-apps.spreadsheet',
    ThirdParty = 'application/vnd.google-apps.drive-sdk',
    Unknown = 'application/vnd.google-apps.unknown',
    Video = 'application/vnd.google-apps.video',
  }

  export class Result {
    id = '';
    name = '';
    @Reflect.metadata('design:type', Date)
    modifiedTime: Date = null;
    version = 0;
  }
}
