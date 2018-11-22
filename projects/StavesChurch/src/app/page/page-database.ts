import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment';
import { DomainHelper, LocalStorageService } from 'core';
import { DriveFile, DriveFileReadQuery, DriveFileSearchQuery } from 'gapi';
import { EMPTY, Observable, of } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';
import { Page } from './page';
import { PageModule } from './page.module';

@Injectable({
  providedIn: PageModule
})
export class PageDatabase {
  fileId = '';
  version = 0;
  pages: Page[];
  private observable: Observable<any[]>;
  private initialising = true;

  constructor(
    private driveFileReadQuery: DriveFileReadQuery,
    private driveFileSearchQuery: DriveFileSearchQuery,
    private storage: LocalStorageService,
  ) {
    this.pages = null;
    this.initialize();
  }

  initialize(): any {
    this.initialising = true;

    const cachedItem = this.storage.get('database');
    if (cachedItem) {
      this.fileId = cachedItem.fileId || '';
      this.version = cachedItem.version || 0;
      this.pages = (cachedItem.pages || []).map(page => DomainHelper.adapt(Page, page));
    }

    this.observable = this.driveFileSearchQuery.execute(env.database).pipe(
      switchMap(files => this.onDriveFileSearch(files)),
      share()
    );
  }

  private onDriveFileSearch(files: DriveFile[]) {
    if (files.length !== 1) {
      this.pages = [];
      this.initialising = false;
      return EMPTY;
    }

    if (this.fileId === files[0].id && this.version === files[0].version) {
      this.initialising = false;
      return of(this.pages);
    }

    this.fileId = files[0].id;
    this.version = files[0].version;

    return this.driveFileReadQuery.execute(this.fileId).pipe(
      map((x: any[]) => {
        // when the cached data is available we don't need the 'Observable' reference anymore
        this.observable = null;

        this.pages = x.map(page => DomainHelper.adapt(Page, page));

        this.storage.set('database', { fileId: this.fileId, version: this.version, pages: x });

        this.initialising = false;

        return this.pages;
      })
    );
  }

  get(kind: string) {
    const result = this.initialising ? this.observable : of(this.pages);
    return result.pipe(
      map(pages => pages
        .filter(x => x.kind === kind)
        .map(page => DomainHelper.adapt(Page, page))
      )
    );
  }
}
