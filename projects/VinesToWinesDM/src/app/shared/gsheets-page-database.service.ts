import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment';
import { DomainHelper, LocalStorageService, Result } from 'core';
// tslint:disable-next-line:max-line-length
import { DriveFile, DriveFileSaveCommand, DriveFileSearchQuery, DriveMimeTypes, GoogleSpreadsheet, SheetBatchUpdateCommand, SheetQuery, SheetReadQuery } from 'gapi';
import { Page, PageDatabase } from 'material-cms-view';
import { EMPTY, Observable, of, throwError, iif, Subscription } from 'rxjs';
import { map, share, switchMap, tap, filter, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GSheetsPageDatabase implements PageDatabase {
  private initialising = true;
  private initialising$: Observable<any>;
  private spreadsheetId: string;
  private spreadsheetUrl: string;
  private readonly sheetName = 'Database';
  private sheetId: number;
  private rowCount: number;
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
    { id: 'K', name: 'rowNum' },
  ];
  private queryWithContent: string;
  private queryWithoutContent: string;
  private idColId: string;
  private kindColId: string;
  private statusColId: string;
  private effectiveFromColId: string;
  private effectiveToColId: string;

  constructor(
    private driveFileSaveCommand: DriveFileSaveCommand,
    private driveFileSearchQuery: DriveFileSearchQuery,
    private sheetReadQuery: SheetReadQuery,
    private sheetQuery: SheetQuery,
    private sheetBatchUpdateCommand: SheetBatchUpdateCommand,
  ) {
    const colsWithoutContent = this.cols.filter(x => x.name !== 'content');
    // tslint:disable-next-line:max-line-length
    this.queryWithoutContent = `select ${colsWithoutContent.map(x => x.id).join(', ')} label ${colsWithoutContent.map(x => `${x.id} '${x.name}'`).join(', ')}`;

    // tslint:disable-next-line:max-line-length
    this.queryWithContent = `select ${this.cols.map(x => x.id).join(', ')} label ${this.cols.map(x => `${x.id} '${x.name}'`).join(', ')}`;

    this.idColId = this.cols.find(x => x.name === 'id').id;
    this.kindColId = this.cols.find(x => x.name === 'kind').id;
    this.statusColId = this.cols.find(x => x.name === 'status').id;
    this.effectiveFromColId = this.cols.find(x => x.name === 'effectiveFrom').id;
    this.effectiveToColId = this.cols.find(x => x.name === 'effectiveTo').id;

    this.initialising$ = this.driveFileSearchQuery.execute(env.database2, DriveMimeTypes.Spreadsheet).pipe(
      tap(_ => this.initialising = false),
      filter(files => files.length > 0),
      tap(files => this.spreadsheetId = files[0].id),
      // tslint:disable-next-line:max-line-length
      switchMap(_ => this.sheetReadQuery.execute(this.spreadsheetId, undefined, 'spreadsheetUrl,sheets(properties/sheetId,properties/title)')),
      filter(spreadsheet => spreadsheet.sheets.length > 0),
      filter(spreadsheet => spreadsheet.sheets[0].properties.title === this.sheetName),
      tap(spreadsheet => this.spreadsheetUrl = spreadsheet.spreadsheetUrl.replace('/edit', '')),
      tap(spreadsheet => this.sheetId = spreadsheet.sheets[0].properties.sheetId),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, 'select count(A) label count(A) "rowCount"', this.sheetName)),
      filter((qr: any[]) => qr.length > 0),
      tap(qr => this.rowCount = qr[0].rowCount),
      share()
    );
  }

  getCurrentPage(kind: string) {
    const today = new Date();
    const param = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    // tslint:disable-next-line:max-line-length
    const whereClause = `${this.kindColId} = '${kind}' AND ${this.statusColId} = 'approved' AND ${this.effectiveFromColId} < date '${param}'`;
    const query = `${this.queryWithContent} where ${whereClause}`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      filter(_ => this.rowCount > 1),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      map((rows: any[]) => {
        if (rows.length === 0) {
          return new Page();
        }

        if (rows.length === 1) {
          return this.convertToPage(rows[0]);
        }

        const approvedPages = rows.map(x => this.convertToPage(x));

        const mostRecentlyApproved = Math.max(...approvedPages.map(x => x.effectiveFrom.valueOf()));

        return approvedPages.find(x => x.effectiveFrom.valueOf() === mostRecentlyApproved);
      })
    );
  }

  getCurrentPages(kind: string) {
    const today = new Date();
    const param = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    // tslint:disable-next-line:max-line-length
    const whereClause = `${this.kindColId} = '${kind}' AND ${this.statusColId} = 'approved' AND ${this.effectiveFromColId} < date '${param}' AND ${this.effectiveToColId} > date '${param}'`;
    const query = `${this.queryWithContent} where ${whereClause}`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      filter(_ => this.rowCount > 1),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      map((rows: any[]) => rows.map(x => this.convertToPage(x)))
    );
  }

  list(kind: string) {
    const whereClause = `${this.kindColId} = '${kind}'`;
    const query = `${this.queryWithoutContent} where ${whereClause}`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      filter(_ => this.rowCount > 1),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      map((rows: any[]) => rows.map(x => this.convertToPage(x)))
    );
  }

  listWithContent(kind: string) {
    const whereClause = `${this.kindColId} = '${kind}'`;
    const query = `${this.queryWithContent} where ${whereClause}`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      filter(_ => this.rowCount > 1),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      map((rows: any[]) => rows.map(x => this.convertToPage(x)))
    );
  }

  get(id: number) {
    const whereClause = `${this.idColId} = '${id}'`;
    const query = `${this.queryWithContent} where ${whereClause}`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      filter(_ => this.rowCount > 1),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      filter((rows: any[]) => rows.length > 0),
      map((rows: any[]) => this.convertToPage(rows[0]))
    );
  }

  add(pageToAdd: Page) {
    const query = `SELECT max(${this.idColId})`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      map(_ => {
        const newPage = DomainHelper.adapt(SheetRow, pageToAdd);
        newPage.id = this.pages.length === 0 ? 1 : Math.max(...this.pages.map(x => x.id)) + 1;
        newPage.identifier = this.uid();
        newPage.version = 1;
        newPage.savedBy = env.g_oauth_login_name;
        newPage.savedOn = new Date();
        // tslint:disable-next-line:no-unused-expression
        typeof pageToAdd.content === 'object' && (newPage.content = JSON.stringify(pageToAdd.content));
      })
    );
  }

  addAll(pagesToAdd: Page<string | {}>[]): Observable<Page<string | {}>[]> {
    throw new Error('Method not implemented.');
  }

  private uid() {
    const tan = new Uint8Array(8);
    crypto.getRandomValues(tan);
    return tan.join('');
  }

  update(updatedPage: Page<string | {}>): Observable<Page<string | {}>> {
    throw new Error('Method not implemented.');
  }

  updateAll(updatedPages: Page<string | {}>[]): Observable<Page<string | {}>[]> {
    throw new Error('Method not implemented.');
  }

  remove(page: Page<string | {}>): Observable<never> {
    throw new Error('Method not implemented.');
  }

  private addRowRequest(page: Page) {
    const row = this.convertToRow(page);

    const request = GoogleSpreadsheet.AppendCellsRequest.Create(this.sheetId, [row]);

    return GoogleSpreadsheet.BatchUpdateRequest.Create(request);
  }

  private updateRowRequest(page: SheetRow) {
    const row = this.convertToRow(page);

    const request = GoogleSpreadsheet.UpdateCellsRequest.Create([row]);
    request.range = GoogleSpreadsheet.GridRange.Create(this.sheetId);
    request.range.startRowIndex = page.rowNum;
    request.range.endRowIndex = page.rowNum + 1;

    return GoogleSpreadsheet.BatchUpdateRequest.Create(request);
  }

  private convertToPage(row: any) {
    const page = DomainHelper.adapt(SheetRow, row);

    // tslint:disable-next-line:no-eval no-unused-expression
    String.hasData(row.effectiveFrom) && (page.effectiveFrom = new Date(eval(row.effectiveFrom)));

    // tslint:disable-next-line:no-eval no-unused-expression
    String.hasData(row.effectiveTo) && (page.effectiveTo = new Date(eval(row.effectiveTo)));

    // tslint:disable-next-line:no-eval no-unused-expression
    String.hasData(row.savedOn) && (page.savedOn = new Date(eval(row.savedOn)));

    return page;
  }

  private convertToRow(page: Page) {
    const cols = this.cols.map(x => GoogleSpreadsheet.CellData.Create(page[x.name]));

    const rowNumColIdx = this.cols.findIndex(x => x.name === 'rowNum');
    const rowNumCol = cols[rowNumColIdx];
    rowNumCol.userEnteredValue = new GoogleSpreadsheet.ExtendedValue();
    rowNumCol.userEnteredValue.formulaValue = '=ROW()';
    const row = GoogleSpreadsheet.RowData.Create(cols);

    return row;
  }
}

class SheetRow extends Page {
  rowNum = 0;
}
