import { Inject, Injectable } from '@angular/core';
import { DomainHelper, LocalStorageService, Result } from 'core';
import { DriveFile, DriveFileReadQuery, DriveFileSaveCommand, DriveFileSearchQuery } from 'gapi';
import { Page, PageDatabase } from 'material-cms-view';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';
import { ProviderConfig, PROVIDER_CONFIG } from './provider-config';

@Injectable({ providedIn: 'root' })
export class GDrivePageDatabase implements PageDatabase {
  fileId = '';
  version = 0;
  pages: Page[];
  private observable: Observable<any[]>;
  private initialising = true;

  constructor(
    @Inject(PROVIDER_CONFIG) private env: ProviderConfig,
    private driveFileReadQuery: DriveFileReadQuery,
    private driveFileSaveCommand: DriveFileSaveCommand,
    private driveFileSearchQuery: DriveFileSearchQuery,
    private storage: LocalStorageService,
  ) {
    this.pages = null;
    this.initialize();
  }

  private initialize(): any {
    this.initialising = true;

    const cachedItem = this.storage.get('database');
    if (cachedItem) {
      this.fileId = cachedItem.fileId || '';
      this.version = cachedItem.version || 0;
      this.pages = (cachedItem.pages || []).map(page => DomainHelper.adapt(Page, page));
    }

    this.observable = this.driveFileSearchQuery.execute(this.env.g_drive_database).pipe(
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

  getCurrentPage(kind: string) {
    return this.listWithContent(kind).pipe(
      map(pages => {
        const now = Date.now();

        const approvedPages = pages.filter(x => x.status === 'Approved' && x.effectiveFrom.valueOf() <= now);
        if (approvedPages.length === 0) {
          return new PageDatabase.GetCurrentPageResult();
        }

        if (approvedPages.length === 1) {
          return DomainHelper.adapt(PageDatabase.GetCurrentPageResult, approvedPages[0]);
        }

        const maxEffectiveFrom = Math.max(...approvedPages.map(x => x.effectiveFrom.valueOf()));

        const currentPage = approvedPages.find(x => x.effectiveFrom.valueOf() === maxEffectiveFrom);

        return DomainHelper.adapt(PageDatabase.GetCurrentPageResult, currentPage);
      })
    );
  }

  getCurrentPages(kind: string) {
    return this.listWithContent(kind).pipe(
      map(pages => {
        const now = Date.now();

        const approvedPages = pages.filter(x => x.status === 'Approved' && x.effectiveFrom.valueOf() <= now);
        if (approvedPages.length === 0) {
          return [];
        }

        const currentPages = approvedPages.filter(x => x.effectiveTo.valueOf() > now);

        return currentPages.map(x => DomainHelper.adapt(PageDatabase.GetCurrentPagesResult, x));
      })
    );
  }

  list(kind: string) {
    return this.listWithContent(kind);
  }

  listWithContent(kind: string) {
    const result = this.initialising ? this.observable : of(this.pages);
    return result.pipe(
      map(pages => pages.filter(x => x.kind === kind).map(page => DomainHelper.adapt(PageDatabase.ListWithContentResult, page)))
    );
  }

  get(id: number) {
    const result = this.initialising ? this.observable : of(this.pages);
    return result.pipe(
      map(pages => pages.find(x => x.id === id).map(page => DomainHelper.adapt(Page, page)))
    );
  }

  add(pageToAdd: Page) {
    this.initialize();

    return this.list(pageToAdd.kind).pipe(
      switchMap(_ => {
        const newPage = DomainHelper.adapt(Page, pageToAdd);
        newPage.id = this.pages.length === 0 ? 1 : Math.max(...this.pages.map(x => x.id)) + 1;
        newPage.version = 1;
        newPage.savedBy = this.env.g_oauth_login_name;
        newPage.savedOn = new Date();
        // tslint:disable-next-line:no-unused-expression
        typeof pageToAdd.content === 'object' && (newPage.content = JSON.stringify(pageToAdd.content));

        (this.pages as any[]).push(newPage);

        return this.driveFileSaveCommand.execute(this.pages, this.fileId).pipe(
          switchMap(x => {
            this.version = x.version;
            return of(DomainHelper.adapt(PageDatabase.AddUpdateResult, newPage));
          })
        );
      })
    );
  }

  addAll(pagesToAdd: Page[]) {
    this.initialize();

    return this.list(pagesToAdd[0].kind).pipe(
      switchMap(_ => {
        const addedItems: Page[] = [];

        pagesToAdd.forEach(pageToAdd => {
          const newPage = DomainHelper.adapt(Page, pageToAdd);
          newPage.id = Math.max(...this.pages.map(x => x.id)) + 1;
          newPage.version = 1;
          newPage.savedBy = this.env.g_oauth_login_name;
          newPage.savedOn = new Date();
          // tslint:disable-next-line:no-unused-expression
          typeof pageToAdd.content === 'object' && (newPage.content = JSON.stringify(pageToAdd.content));

          addedItems.push(newPage);

          (this.pages as any[]).push(newPage);
        });

        return this.driveFileSaveCommand.execute(this.pages, this.fileId).pipe(
          switchMap(x => {
            this.version = x.version;
            return of(addedItems.map(item => DomainHelper.adapt(PageDatabase.AddUpdateResult, item)));
          })
        );
      })
    );
  }

  update(updatedPage: Page) {
    this.initialize();

    return this.get(updatedPage.id).pipe(
      switchMap(_ => {
        const result = new Result();

        const savedPage = this.pages.find(x => x.id === updatedPage.id);
        if (!savedPage) {
          return throwError(Result.CreateErrorResult(`Cannot find item with id ${updatedPage.id}.`));
        }

        if (savedPage.version !== updatedPage.version) {
          // tslint:disable-next-line:max-line-length
          return throwError(Result.CreateErrorResult(`This was last updated by ${updatedPage.savedBy} on ${updatedPage.savedOn}. Please refresh your page.`));
        }

        DomainHelper.adapt(savedPage, updatedPage);

        savedPage.version++;
        savedPage.savedBy = this.env.g_oauth_login_name;
        savedPage.savedOn = new Date();
        // tslint:disable-next-line:no-unused-expression
        typeof updatedPage.content === 'object' && (savedPage.content = JSON.stringify(updatedPage.content));

        return this.driveFileSaveCommand.execute(this.pages, this.fileId).pipe(
          switchMap(x => {
            this.version = x.version;
            return of(DomainHelper.adapt(PageDatabase.AddUpdateResult, savedPage));
          })
        );
      })
    );
  }

  updateAll(updatedPages: Page[]) {
    this.initialize();

    return this.get(updatedPages[0].id).pipe(
      switchMap(_ => {
        const result = new Result();

        const updatedItems: Page[] = [];

        updatedPages.forEach(updatePage => {
          const savedPage = this.pages.find(x => x.id === updatePage.id);
          if (!savedPage) {
            return throwError(Result.CreateErrorResult(`Cannot find item with id ${updatePage.id}.`));
          }

          if (savedPage.version !== updatePage.version) {
            // tslint:disable-next-line:max-line-length
            return throwError(Result.CreateErrorResult(`Item with id ${updatePage.id} was last updated by ${updatePage.savedBy} on ${updatePage.savedOn}. Please refresh your page.`));
          }

          DomainHelper.adapt(savedPage, updatePage);

          savedPage.version++;
          savedPage.savedBy = this.env.g_oauth_login_name;
          savedPage.savedOn = new Date();
          // tslint:disable-next-line:no-unused-expression
          typeof updatePage.content === 'object' && (savedPage.content = JSON.stringify(updatePage.content));

          updatedItems.push(savedPage);
        });

        return this.driveFileSaveCommand.execute(this.pages, this.fileId).pipe(
          switchMap(x => {
            this.version = x.version;
            return of(updatedItems.map(item => DomainHelper.adapt(PageDatabase.AddUpdateResult, item)));
          })
        );
      })
    );
  }

  remove(page: Page) {
    this.initialize();

    return this.get(page.id).pipe(
      switchMap(_ => {
        const result = new Result();

        const itemIdx = this.pages.findIndex(x => x.id === page.id);
        if (itemIdx === -1) {
          return throwError(Result.CreateErrorResult(`Cannot find item with id ${page.id}.`));
        }

        if (this.pages[itemIdx].version !== page.version) {
          // tslint:disable-next-line:max-line-length
          return throwError(Result.CreateErrorResult(`This was last updated by ${page.savedBy} on ${page.savedOn}. Please refresh your page.`));
        }

        this.pages.splice(itemIdx, 1);

        return this.driveFileSaveCommand.execute(this.pages, this.fileId).pipe(
          switchMap(x => {
            this.version = x.version;
            return EMPTY;
          })
        );
      })
    );
  }
}
