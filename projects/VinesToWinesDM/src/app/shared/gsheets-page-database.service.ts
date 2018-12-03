import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment';
import { DomainHelper, LocalStorageService, Result } from 'core';
// tslint:disable-next-line:max-line-length
import { DriveFile, DriveFileSaveCommand, DriveFileSearchQuery, DriveMimeTypes, GoogleSpreadsheet, SheetBatchUpdateCommand, SheetQuery, SheetReadQuery } from 'gapi';
import { Page, PageDatabase } from 'material-cms-view';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { map, share, switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GSheetsPageDatabase implements PageDatabase {
  fileId = '';
  version = 0;
  pages: Page[];
  private observable: Observable<any[]>;
  private initialising = true;
  private readonly sheetName = 'Database';
  // tslint:disable-next-line:max-line-length
  private readonly cols = [
    { id: 'A', name: 'id' },
    { id: 'B', name: 'kind' },
    { id: 'C', name: 'identifier' },
    { id: 'D', name: 'effectiveFrom' },
    { id: 'E', name: 'effectiveTo' },
    { id: 'F', name: 'status' },
    { id: 'G', name: 'savedBy' },
    { id: 'H', name: 'savedOn' },
    { id: 'I', name: 'version' },
    { id: 'J', name: 'content' },
  ];
  private sheetId: number;

  constructor(
    private driveFileSaveCommand: DriveFileSaveCommand,
    private driveFileSearchQuery: DriveFileSearchQuery,
    private sheetReadQuery: SheetReadQuery,
    private sheetQuery: SheetQuery,
    private storage: LocalStorageService,
    private sheetBatchUpdateCommand: SheetBatchUpdateCommand,
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

    this.observable = this.driveFileSearchQuery.execute(env.database2, DriveMimeTypes.Spreadsheet).pipe(
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

    // tslint:disable-next-line:max-line-length
    const query = `select ${this.cols.map(x => x.id).join(', ')} label ${this.cols.map(x => `${x.id} ${x.name}`).join(', ')}`;

    // tslint:disable-next-line:max-line-length
    return this.sheetReadQuery.execute(this.fileId, this.sheetName, 'spreadsheetUrl,sheets(properties/sheetId,data(rowData(values/effectiveValue,values/formattedValue)))').pipe(
      tap(spreadsheet => this.sheetId = spreadsheet.sheets[0].properties.sheetId),
      // switchMap(spreadsheet => this.sheetQuery.execute(spreadsheet.spreadsheetUrl.replace('/edit', ''), query)),
      map(spreadsheet => {
        // when the cached data is available we don't need the 'Observable' reference anymore
        this.observable = null;

        if (spreadsheet.sheets[0].data[0].rowData.length > 1) {
          this.pages = spreadsheet.sheets[0].data[0].rowData.slice(1).map(row => {
            const page = new Page();

            page.id = row.values[0].effectiveValue.numberValue;
            page.kind = row.values[1].effectiveValue.stringValue;
            page.identifier = row.values[2].effectiveValue.stringValue;

            return page;
          });
        } else {
          this.pages = [];
        }

        // this.pages = qr.map(page => DomainHelper.adapt(Page, page));

        // this.storage.set('database', { fileId: this.fileId, version: this.version, pages: qr });

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

  add(pageToAdd: Page) {
    this.initialize();

    return this.get(pageToAdd.kind).pipe(
      switchMap(_ => {
        const newPage = DomainHelper.adapt(Page, pageToAdd);
        newPage.id = this.pages.length === 0 ? 1 : Math.max(...this.pages.map(x => x.id)) + 1;
        newPage.identifier = this.uid();
        newPage.version = 1;
        newPage.savedBy = env.g_oauth_login_name;
        newPage.savedOn = new Date();
        // tslint:disable-next-line:no-unused-expression
        typeof pageToAdd.content === 'object' && (newPage.content = JSON.stringify(pageToAdd.content));

        (this.pages as any[]).push(newPage);

        const bur = this.convertToBatchUpdateRequest(newPage);

        return this.sheetBatchUpdateCommand.execute(this.fileId, [bur]).pipe(
          switchMap(x => this.driveFileSearchQuery.execute(env.database2, DriveMimeTypes.Spreadsheet)),
          tap(x => this.version = x[0].version),
          switchMap(x => of(DomainHelper.adapt(Page, newPage)))
        );
      })
    );
  }

  private convertToBatchUpdateRequest(page: Page) {
    const cols = this.cols.map(x => GoogleSpreadsheet.CellData.Create(page[x.name]));

    const row = GoogleSpreadsheet.RowData.Create(cols);

    const request = GoogleSpreadsheet.AppendCellsRequest.Create(this.sheetId, [row]);

    return GoogleSpreadsheet.BatchUpdateRequest.Create(request);
  }

  addAll(pagesToAdd: Page[]) {
    this.initialize();

    return this.get(pagesToAdd[0].kind).pipe(
      switchMap(_ => {
        const addedItems: Page[] = [];

        pagesToAdd.forEach(pageToAdd => {
          const newPage = DomainHelper.adapt(Page, pageToAdd);
          newPage.id = Math.max(...this.pages.map(x => x.id)) + 1;
          newPage.identifier = this.uid();
          newPage.version = 1;
          newPage.savedBy = env.g_oauth_login_name;
          newPage.savedOn = new Date();
          // tslint:disable-next-line:no-unused-expression
          typeof pageToAdd.content === 'object' && (newPage.content = JSON.stringify(pageToAdd.content));

          addedItems.push(newPage);

          (this.pages as any[]).push(newPage);
        });

        return this.driveFileSaveCommand.execute(this.pages, this.fileId).pipe(
          switchMap(x => {
            this.version = x.version;
            return of(addedItems.map(item => DomainHelper.adapt(Page, item)));
          })
        );
      })
    );
  }

  private uid() {
    const tan = new Uint8Array(8);
    crypto.getRandomValues(tan);
    return tan.join('');
  }

  update(updatedPage: Page) {
    this.initialize();

    return this.get(updatedPage.kind).pipe(
      switchMap(_ => {
        const result = new Result();

        const savedPage = this.pages.find(x => x.id === updatedPage.id);
        if (!savedPage) {
          result.addError(`Cannot find item with id ${updatedPage.id}.`);
          return throwError(result);
        }

        if (savedPage.version !== updatedPage.version) {
          result.addError(`This was last updated by ${updatedPage.savedBy} on ${updatedPage.savedOn}. Please refresh your page.`);
          return throwError(result);
        }

        DomainHelper.adapt(savedPage, updatedPage);

        savedPage.version++;
        savedPage.savedBy = env.g_oauth_login_name;
        savedPage.savedOn = new Date();
        // tslint:disable-next-line:no-unused-expression
        typeof updatedPage.content === 'object' && (savedPage.content = JSON.stringify(updatedPage.content));

        return this.driveFileSaveCommand.execute(this.pages, this.fileId).pipe(
          switchMap(x => {
            this.version = x.version;
            return of(DomainHelper.adapt(Page, savedPage));
          })
        );
      })
    );
  }

  updateAll(updatedPages: Page[]) {
    this.initialize();

    return this.get(updatedPages[0].kind).pipe(
      switchMap(_ => {
        const result = new Result();

        const updatedItems: Page[] = [];

        updatedPages.forEach(updatePage => {
          const savedPage = this.pages.find(x => x.id === updatePage.id);
          if (!savedPage) {
            result.addError(`Cannot find item with id ${updatePage.id}.`);
            return throwError(result);
          }

          if (savedPage.version !== updatePage.version) {
            // tslint:disable-next-line:max-line-length
            result.addError(`Item with id ${updatePage.id} was last updated by ${updatePage.savedBy} on ${updatePage.savedOn}. Please refresh your page.`);
            return throwError(result);
          }

          DomainHelper.adapt(savedPage, updatePage);

          savedPage.version++;
          savedPage.savedBy = env.g_oauth_login_name;
          savedPage.savedOn = new Date();
          // tslint:disable-next-line:no-unused-expression
          typeof updatePage.content === 'object' && (savedPage.content = JSON.stringify(updatePage.content));

          updatedItems.push(savedPage);
        });

        return this.driveFileSaveCommand.execute(this.pages, this.fileId).pipe(
          switchMap(x => {
            this.version = x.version;
            return of(updatedItems.map(item => DomainHelper.adapt(Page, item)));
          })
        );
      })
    );
  }

  remove(page: Page) {
    this.initialize();

    return this.get(page.kind).pipe(
      switchMap(_ => {
        const result = new Result();

        const itemIdx = this.pages.findIndex(x => x.id === page.id);
        if (itemIdx === -1) {
          result.addError(`Cannot find item with id ${page.id}.`);
          return throwError(result);
        }

        if (this.pages[itemIdx].version !== page.version) {
          result.addError(`This was last updated by ${page.savedBy} on ${page.savedOn}. Please refresh your page.`);
          return throwError(result);
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
