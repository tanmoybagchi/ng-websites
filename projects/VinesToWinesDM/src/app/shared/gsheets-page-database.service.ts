import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment';
import { DomainHelper, Result } from 'core';
// tslint:disable-next-line:max-line-length
import { DriveCreateCommand, DriveFileSearchQuery, DriveMimeTypes, GoogleSpreadsheet, SheetBatchUpdateCommand, SheetQuery, SheetReadQuery } from 'gapi';
import { Page, PageDatabase } from 'material-cms-view';
import { EMPTY, iif, Observable, of, throwError } from 'rxjs';
import { filter, map, share, switchMap, tap } from 'rxjs/operators';

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
  private idColId: string;
  private kindColId: string;
  private statusColId: string;
  private effectiveFromColId: string;
  private effectiveToColId: string;
  private selectClauseWithoutContent: string;
  private labelClauseWithoutContent: string;
  private selectClauseWithContent: string;
  private labelClauseWithContent: string;
  private versionColId: string;
  private rowNumColId: string;

  constructor(
    private driveCreateCommand: DriveCreateCommand,
    private driveFileSearchQuery: DriveFileSearchQuery,
    private sheetReadQuery: SheetReadQuery,
    private sheetQuery: SheetQuery,
    private sheetBatchUpdateCommand: SheetBatchUpdateCommand,
  ) {
    const colsWithoutContent = this.cols.filter(x => x.name !== 'content');
    this.selectClauseWithoutContent = `select ${colsWithoutContent.map(x => x.id).join(', ')}`;
    this.labelClauseWithoutContent = `label ${colsWithoutContent.map(x => `${x.id} '${x.name}'`).join(', ')}`;

    this.selectClauseWithContent = `select ${this.cols.map(x => x.id).join(', ')}`;
    this.labelClauseWithContent = `label ${this.cols.map(x => `${x.id} '${x.name}'`).join(', ')}`;

    this.idColId = this.cols.find(x => x.name === 'id').id;
    this.kindColId = this.cols.find(x => x.name === 'kind').id;
    this.statusColId = this.cols.find(x => x.name === 'status').id;
    this.effectiveFromColId = this.cols.find(x => x.name === 'effectiveFrom').id;
    this.effectiveToColId = this.cols.find(x => x.name === 'effectiveTo').id;
    this.versionColId = this.cols.find(x => x.name === 'version').id;
    this.rowNumColId = this.cols.find(x => x.name === 'rowNum').id;

    this.initialising$ = this.driveFileSearchQuery.execute(env.database2, DriveMimeTypes.Spreadsheet).pipe(
      tap(_ => this.initialising = false),
      filter(files => files.length > 0),
      tap(files => this.spreadsheetId = files[0].id),
      // tslint:disable-next-line:max-line-length
      switchMap(_ => this.sheetReadQuery.execute(this.spreadsheetId, undefined, 'spreadsheetUrl,sheets(properties/sheetId,properties/title)')),
      filter(spreadsheet => spreadsheet.sheets.length > 0),
      filter(spreadsheet => spreadsheet.sheets.findIndex(s => s.properties.title === this.sheetName) > -1),
      tap(spreadsheet => this.spreadsheetUrl = spreadsheet.spreadsheetUrl.replace('/edit', '')),
      tap(spreadsheet => this.sheetId = spreadsheet.sheets.find(s => s.properties.title === this.sheetName).properties.sheetId),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, 'select count(A) label count(A) "rowCount"', this.sheetName)),
      filter((qr: any[]) => qr.length > 0),
      tap(qr => this.rowCount = qr[0].rowCount),
      share()
    );
  }

  warmup() {
    this.initialising$.subscribe();
  }

  getCurrentPage(kind: string) {
    const today = new Date();
    // tslint:disable-next-line:max-line-length
    const param = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    // tslint:disable-next-line:max-line-length
    const whereClause = `where ${this.kindColId} = '${kind}' AND ${this.statusColId} = 'Approved' AND ${this.effectiveFromColId} < datetime '${param}'`;
    const query = `${this.selectClauseWithContent} ${whereClause} ${this.labelClauseWithContent}`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      filter(_ => this.rowCount > 1),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      map((rows: any[]) => {
        if (rows.length === 0) {
          return new Page();
        }

        if (rows.length === 1) {
          return DomainHelper.adapt(SheetRow, rows[0]);
        }

        const approvedPages = rows.map(x => DomainHelper.adapt(SheetRow, x));

        const mostRecentlyApproved = Math.max(...approvedPages.map(x => x.effectiveFrom.valueOf()));

        return approvedPages.find(x => x.effectiveFrom.valueOf() === mostRecentlyApproved);
      })
    );
  }

  getCurrentPages(kind: string) {
    const today = new Date();
    // tslint:disable-next-line:max-line-length
    const param = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    // tslint:disable-next-line:max-line-length
    const whereClause = `where ${this.kindColId} = '${kind}' AND ${this.statusColId} = 'Approved' AND ${this.effectiveFromColId} < datetime '${param}' AND (${this.effectiveToColId} is null OR ${this.effectiveToColId}  = 'null' OR ${this.effectiveToColId} > datetime '${param}')`;
    const query = `${this.selectClauseWithContent} ${whereClause} ${this.labelClauseWithContent}`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      filter(_ => this.rowCount > 1),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      map((rows: any[]) => rows.map(x => DomainHelper.adapt(SheetRow, x)))
    );
  }

  list(kind: string) {
    const whereClause = `where ${this.kindColId} = '${kind}'`;
    const query = `${this.selectClauseWithoutContent} ${whereClause} ${this.labelClauseWithoutContent}`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      filter(_ => this.rowCount > 1),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      map((rows: any[]) => rows.map(x => DomainHelper.adapt(SheetRow, x)))
    );
  }

  listWithContent(kind: string) {
    const whereClause = `where ${this.kindColId} = '${kind}'`;
    const query = `${this.selectClauseWithContent} ${whereClause} ${this.labelClauseWithContent}`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      filter(_ => this.rowCount > 1),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      map((rows: any[]) => rows.map(x => DomainHelper.adapt(SheetRow, x)))
    );
  }

  get(id: number) {
    const whereClause = `where ${this.idColId} = ${id}`;
    const query = `${this.selectClauseWithContent} ${whereClause} ${this.labelClauseWithContent}`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      filter(_ => this.rowCount > 1),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      filter((rows: any[]) => rows.length > 0),
      map((rows: any[]) => DomainHelper.adapt(SheetRow, rows[0]))
    );
  }

  add(pageToAdd: Page) {
    const query = `SELECT max(${this.idColId}) label max(${this.idColId}) 'maxId'`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      switchMap(_ => this.initializeSpreadsheet()),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      map(qr => this.createSheetRow(pageToAdd, ++qr[0].maxId)),
      map(sheetRow => ({ addRowRequest: this.createAddRowRequest(sheetRow), sheetRow })),
      switchMap(x => this.sheetBatchUpdateCommand.execute(this.spreadsheetId, [x.addRowRequest]).pipe(map(_ => x.sheetRow))),
      map(sheetRow => DomainHelper.adapt(pageToAdd, sheetRow))
    );
  }

  private createSheetRow(page: Page, id: number) {
    const sheetRow = DomainHelper.adapt(SheetRow, page);

    sheetRow.id = id;
    sheetRow.identifier = this.uid();
    sheetRow.version = 1;
    sheetRow.savedBy = env.g_oauth_login_name;
    sheetRow.savedOn = new Date();
    // tslint:disable-next-line:no-unused-expression
    typeof page.content === 'object' && (sheetRow.content = JSON.stringify(page.content));

    return sheetRow;
  }

  addAll(pagesToAdd: Page[]) {
    const query = `SELECT max(${this.idColId}) label max(${this.idColId}) 'maxId'`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      switchMap(_ => this.initializeSpreadsheet()),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      map(qr => qr[0].maxId),
      map(maxId => pagesToAdd.map(pageToAdd => this.createSheetRow(pageToAdd, ++maxId))),
      map(sheetRows => ({ addRowRequest: sheetRows.map(sheetRow => this.createAddRowRequest(sheetRow)), sheetRows })),
      switchMap(x => this.sheetBatchUpdateCommand.execute(this.spreadsheetId, x.addRowRequest).pipe(map(_ => x.sheetRows))),
      tap(sheetRows => sheetRows.forEach(sheetRow => DomainHelper.adapt(pagesToAdd.find(pg => pg.id === sheetRow.id), sheetRow))),
      map(_ => pagesToAdd)
    );
  }

  private uid() {
    const tan = new Uint8Array(8);
    crypto.getRandomValues(tan);
    return tan.join('');
  }

  update(updatedPage: Page) {
    // tslint:disable-next-line:max-line-length
    const query = `SELECT ${this.versionColId}, ${this.rowNumColId} where ${this.idColId} = ${updatedPage.id} label ${this.versionColId} 'version', ${this.rowNumColId} 'rowNum'`;

    return this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName).pipe(
      switchMap((qr: any[]) => this.ensureLatestCopy(qr[0], updatedPage)),
      map(qr => this.updateSheetRow(updatedPage, qr)),
      map(sheetRow => ({ updateRowRequest: this.createUpdateRowRequest(sheetRow), sheetRow })),
      switchMap(x => this.sheetBatchUpdateCommand.execute(this.spreadsheetId, [x.updateRowRequest]).pipe(map(_ => x.sheetRow))),
      map(sheetRow => DomainHelper.adapt(updatedPage, sheetRow))
    );
  }

  private ensureLatestCopy(qr: any, updatedPage: Page) {
    return qr.version !== updatedPage.version
      // tslint:disable-next-line:max-line-length
      ? throwError(Result.CreateErrorResult(`This was last updated by ${updatedPage.savedBy} on ${updatedPage.savedOn}. Please refresh your page.`))
      : of(qr);
  }

  private updateSheetRow(page: Page, qr: any) {
    const res = DomainHelper.adapt(SheetRow, page);

    res.version++;
    res.savedBy = env.g_oauth_login_name;
    res.savedOn = new Date();
    res.rowNum = qr.rowNum;

    // tslint:disable-next-line:no-unused-expression
    typeof page.content === 'object' && (res.content = JSON.stringify(page.content));

    return res;
  }

  updateAll(updatedPages: Page[]) {
    const selectClause = `SELECT ${this.idColId}, ${this.versionColId}, ${this.rowNumColId}`;
    const whereClause = `where ${updatedPages.map(x => `${this.idColId} = ${x.id}`).join(' or ')}`;
    const labelClause = `label ${this.idColId} 'id', ${this.versionColId} 'version', ${this.rowNumColId} 'rowNum'`;
    const query = `${selectClause} ${whereClause} ${labelClause}`;

    return this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName).pipe(
      switchMap((qr: any[]) => this.ensureLatestCopies(qr, updatedPages)),
      map((qr: any[]) => updatedPages.map(updatedPage => this.updateSheetRow(updatedPage, qr.find(x => x.id === updatedPage.id)))),
      map(sheetRows => ({ updateRowsRequest: sheetRows.map(sheetRow => this.createUpdateRowRequest(sheetRow)), sheetRows })),
      switchMap(x => this.sheetBatchUpdateCommand.execute(this.spreadsheetId, x.updateRowsRequest).pipe(map(_ => x.sheetRows))),
      tap(sheetRows => sheetRows.forEach(sheetRow => DomainHelper.adapt(updatedPages.find(pg => pg.id === sheetRow.id), sheetRow))),
      map(_ => updatedPages)
    );
  }

  private ensureLatestCopies(savedPages: any[], updatedPages: Page[]) {
    const result = new Result();

    updatedPages.forEach(updatedPage => {
      const savedPage = savedPages.find(x => x.id === updatedPage.id);
      if (savedPage === null) {
        result.addError(`Could not find page with id ${updatedPage.id}.`);
      } else if (updatedPage.version !== savedPage.version) {
        result.addError(`This was last updated by ${updatedPage.savedBy} on ${updatedPage.savedOn}. Please refresh your page.`);
      }
    });

    return result.hasErrors ? throwError(result) : of(savedPages);
  }

  remove(page: Page) {
    // tslint:disable-next-line:max-line-length
    const query = `SELECT ${this.versionColId}, ${this.rowNumColId} where ${this.idColId} = ${page.id} label ${this.versionColId} 'version', ${this.rowNumColId} 'rowNum'`;

    return this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName).pipe(
      switchMap((qr: any[]) => this.ensureLatestCopy(qr[0], page)),
      map(qr => GoogleSpreadsheet.DimensionRange.Create(this.sheetId, GoogleSpreadsheet.Dimension.ROWS, qr.RowNum - 1)),
      map(dimensionRange => GoogleSpreadsheet.DeleteDimensionRequest.Create(dimensionRange)),
      map(deleteDimensionRequest => GoogleSpreadsheet.BatchUpdateRequest.Create(deleteDimensionRequest)),
      switchMap(batchUpdateRequest => this.sheetBatchUpdateCommand.execute(this.spreadsheetId, [batchUpdateRequest])),
      switchMap(batchUpdateResponse => EMPTY)
    );
  }

  private initializeSpreadsheet() {
    if (String.hasData(this.spreadsheetId)) {
      return of(true);
    }

    return this.driveCreateCommand.execute(env.database2, DriveMimeTypes.Spreadsheet).pipe(
      tap(files => this.spreadsheetId = files.id),
      switchMap(_ => this.sheetReadQuery.execute(this.spreadsheetId, undefined, 'spreadsheetUrl,sheets(properties)')),
      tap(ss => this.spreadsheetUrl = ss.spreadsheetUrl.replace('/edit', '')),
      tap(ss => this.sheetId = ss.sheets[0].properties.sheetId),
      switchMap(ss => this.updateSheet(ss)),
      // tap(bur => this.sheetId = bur.replies[0].addSheet.properties.sheetId),
      switchMap(_ => this.addDatabaseSheetHeader()),
      // tslint:disable-next-line:max-line-length
      tap(_ => this.rowCount = 2),
      switchMap(_ => of(true))
    );
  }

  private updateSheet(ss: GoogleSpreadsheet) {
    const sp = ss.sheets[0].properties;
    sp.title = this.sheetName;
    sp.gridProperties.frozenRowCount = 1;
    const updateSheetRequest = GoogleSpreadsheet.UpdateSheetPropertiesRequest.Create(sp);
    const bur = GoogleSpreadsheet.BatchUpdateRequest.Create(updateSheetRequest);

    return this.sheetBatchUpdateCommand.execute(this.spreadsheetId, [bur]);
  }

  private addDatabaseSheetHeader() {
    const headerCols = this.cols.map(x => GoogleSpreadsheet.CellData.Create(x.name));
    const headerRow = GoogleSpreadsheet.RowData.Create(headerCols);

    const fakePage = new SheetRow();
    fakePage.content = 'Do not delete this row';
    const fakeDataRow = this.convertToRow(fakePage);

    const appendCellsRequest = GoogleSpreadsheet.AppendCellsRequest.Create(this.sheetId, [headerRow, fakeDataRow]);

    const bur = GoogleSpreadsheet.BatchUpdateRequest.Create(appendCellsRequest);

    return this.sheetBatchUpdateCommand.execute(this.spreadsheetId, [bur]);
  }

  private createAddRowRequest(page: Page) {
    const row = this.convertToRow(page);

    const request = GoogleSpreadsheet.AppendCellsRequest.Create(this.sheetId, [row]);

    return GoogleSpreadsheet.BatchUpdateRequest.Create(request);
  }

  private createUpdateRowRequest(page: SheetRow) {
    const row = this.convertToRow(page);

    const request = GoogleSpreadsheet.UpdateCellsRequest.Create([row]);
    request.range = GoogleSpreadsheet.GridRange.Create(this.sheetId);
    request.range.startRowIndex = page.rowNum - 1;
    request.range.endRowIndex = page.rowNum;

    return GoogleSpreadsheet.BatchUpdateRequest.Create(request);
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
