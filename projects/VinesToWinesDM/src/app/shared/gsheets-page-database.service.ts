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

  private readonly pageColMapping = {
    id: 'A',
    kind: 'B',
    effectiveFrom: 'C',
    effectiveTo: 'D',
    status: 'E',
    savedBy: 'F',
    savedOn: 'G',
    version: 'H',
    content: 'I',
    rowNum: 'J'
  };

  constructor(
    private driveCreateCommand: DriveCreateCommand,
    private driveFileSearchQuery: DriveFileSearchQuery,
    private sheetReadQuery: SheetReadQuery,
    private sheetQuery: SheetQuery,
    private sheetBatchUpdateCommand: SheetBatchUpdateCommand,
  ) {
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

  getCurrentPage(kind: string) {
    const colsToReturn = ['effectiveFrom', 'content'];
    const selectClause = this.getSelectClause(colsToReturn);
    const labelClause = this.getLabelClause(colsToReturn);

    const today = new Date();
    // tslint:disable-next-line:max-line-length
    const param = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    // tslint:disable-next-line:max-line-length
    const whereClause = `where ${this.pageColMapping.kind} = '${kind}' AND ${this.pageColMapping.status} = 'Approved' AND ${this.pageColMapping.effectiveFrom} < datetime '${param}'`;

    const query = `${selectClause} ${whereClause} ${labelClause}`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      filter(_ => this.rowCount > 1),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      map((rows: any[]) => {
        if (rows.length === 0) {
          return new PageDatabase.GetCurrentPageResult();
        }

        if (rows.length === 1) {
          return DomainHelper.adapt(PageDatabase.GetCurrentPageResult, rows[0]);
        }

        const maxEffectiveFrom = Math.max(...rows.map(x => x.effectiveFrom.valueOf()));

        const currentPage = rows.find(x => x.effectiveFrom.valueOf() === maxEffectiveFrom);

        return DomainHelper.adapt(PageDatabase.GetCurrentPageResult, currentPage);
      })
    );
  }

  getCurrentPages(kind: string) {
    const today = new Date();

    const colsToReturn = ['id', 'effectiveFrom', 'effectiveTo', 'content'];
    const selectClause = this.getSelectClause(colsToReturn);
    const labelClause = this.getLabelClause(colsToReturn);

    // tslint:disable-next-line:max-line-length
    const param = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    // tslint:disable-next-line:max-line-length
    const whereClause = `where ${this.pageColMapping.kind} = '${kind}' AND ${this.pageColMapping.status} = 'Approved' AND ${this.pageColMapping.effectiveFrom} < datetime '${param}' AND (${this.pageColMapping.effectiveTo} is null or ${this.pageColMapping.effectiveTo} > datetime '${param}')`;

    const query = `${selectClause} ${whereClause} ${labelClause}`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      filter(_ => this.rowCount > 1),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      map((rows: any[]) => rows.map(x => DomainHelper.adapt(PageDatabase.GetCurrentPagesResult, x)))
    );
  }

  list(kind: string) {
    const colsToReturn = ['id', 'effectiveFrom', 'effectiveTo', 'status'];

    const selectClause = this.getSelectClause(colsToReturn);
    const labelClause = this.getLabelClause(colsToReturn);
    const whereClause = `where ${this.pageColMapping.kind} = '${kind}'`;

    const query = `${selectClause} ${whereClause} ${labelClause}`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      filter(_ => this.rowCount > 1),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      map((rows: any[]) => rows.map(x => DomainHelper.adapt(PageDatabase.ListResult, x)))
    );
  }

  listWithContent(kind: string) {
    const colsToReturn = ['id', 'effectiveFrom', 'effectiveTo', 'status', 'content'];

    const selectClause = this.getSelectClause(colsToReturn);
    const labelClause = this.getLabelClause(colsToReturn);
    const whereClause = `where ${this.pageColMapping.kind} = '${kind}'`;

    const query = `${selectClause} ${whereClause} ${labelClause}`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      filter(_ => this.rowCount > 1),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      map((rows: any[]) => rows.map(x => DomainHelper.adapt(PageDatabase.ListWithContentResult, x)))
    );
  }

  get(id: number) {
    const selectClause = 'select *';
    const labelClause = this.getLabelClause(Object.keys(this.pageColMapping));
    const whereClause = `where ${this.pageColMapping.id} = ${id}`;

    const query = `${selectClause} ${whereClause} ${labelClause}`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      filter(_ => this.rowCount > 1),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      filter((rows: any[]) => rows.length > 0),
      map((rows: any[]) => DomainHelper.adapt(Page, rows[0]))
    );
  }

  add(pageToAdd: Page) {
    const query = `SELECT max(${this.pageColMapping.id}) label max(${this.pageColMapping.id}) 'maxId'`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      switchMap(_ => this.initializeSpreadsheet()),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      map(qr => this.createSheetRow(pageToAdd, ++qr[0].maxId)),
      map(sheetRow => ({ addRowRequest: this.createAddRowRequest(sheetRow), sheetRow })),
      switchMap(x => this.sheetBatchUpdateCommand.execute(this.spreadsheetId, [x.addRowRequest]).pipe(map(_ => x.sheetRow))),
      map(sheetRow => DomainHelper.adapt(PageDatabase.AddUpdateResult, sheetRow))
    );
  }

  addAll(pagesToAdd: Page[]) {
    const query = `SELECT max(${this.pageColMapping.id}) label max(${this.pageColMapping.id}) 'maxId'`;

    return iif(() => this.initialising, this.initialising$, of(true)).pipe(
      switchMap(_ => this.initializeSpreadsheet()),
      switchMap(_ => this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName)),
      map(qr => pagesToAdd.map(pageToAdd => this.createSheetRow(pageToAdd, ++qr[0].maxId))),
      map(sheetRows => ({ addRowRequest: sheetRows.map(sheetRow => this.createAddRowRequest(sheetRow)), sheetRows })),
      switchMap(x => this.sheetBatchUpdateCommand.execute(this.spreadsheetId, x.addRowRequest).pipe(map(_ => x.sheetRows))),
      map(sheetRows => sheetRows.map(sheetRow => DomainHelper.adapt(PageDatabase.AddUpdateResult, sheetRow)))
    );
  }

  private createSheetRow(page: Page, id: number) {
    const sheetRow = DomainHelper.adapt(SheetRow, page);

    sheetRow.id = id;
    sheetRow.version = 1;
    sheetRow.savedBy = env.g_oauth_login_name;
    sheetRow.savedOn = new Date();
    // tslint:disable-next-line:no-unused-expression
    typeof page.content === 'object' && (sheetRow.content = JSON.stringify(page.content));

    return sheetRow;
  }

  update(updatedPage: Page) {
    const colsToReturn = ['version', 'rowNum'];

    const selectClause = this.getSelectClause(colsToReturn);
    const labelClause = this.getLabelClause(colsToReturn);
    const whereClause = `where ${this.pageColMapping.id} = ${updatedPage.id}`;

    const query = `${selectClause} ${whereClause} ${labelClause}`;

    return this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName).pipe(
      switchMap((qr: any[]) => this.ensureLatestCopy(qr[0], updatedPage)),
      map(qr => this.updateSheetRow(updatedPage, qr)),
      map(sheetRow => ({ updateRowRequest: this.createUpdateRowRequest(sheetRow), sheetRow })),
      switchMap(x => this.sheetBatchUpdateCommand.execute(this.spreadsheetId, [x.updateRowRequest]).pipe(map(_ => x.sheetRow))),
      map(sheetRow => DomainHelper.adapt(PageDatabase.AddUpdateResult, sheetRow))
    );
  }

  private ensureLatestCopy(qr: any, updatedPage: Page) {
    return qr.version !== updatedPage.version
      // tslint:disable-next-line:max-line-length
      ? throwError(Result.CreateErrorResult(`This was last updated by ${updatedPage.savedBy} on ${updatedPage.savedOn}. Please refresh your page.`))
      : of(qr);
  }

  updateAll(updatedPages: Page[]) {
    const colsToReturn = ['id', 'version', 'rowNum'];

    const selectClause = this.getSelectClause(colsToReturn);
    const labelClause = this.getLabelClause(colsToReturn);
    const whereClause = `where ${updatedPages.map(x => `${this.pageColMapping.id} = ${x.id}`).join(' or ')}`;

    const query = `${selectClause} ${whereClause} ${labelClause}`;

    return this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName).pipe(
      switchMap((qr: any[]) => this.ensureLatestCopies(qr, updatedPages)),
      map((qr: any[]) => updatedPages.map(updatedPage => this.updateSheetRow(updatedPage, qr.find(x => x.id === updatedPage.id)))),
      map(sheetRows => ({ updateRowsRequest: sheetRows.map(sheetRow => this.createUpdateRowRequest(sheetRow)), sheetRows })),
      switchMap(x => this.sheetBatchUpdateCommand.execute(this.spreadsheetId, x.updateRowsRequest).pipe(map(_ => x.sheetRows))),
      tap(sheetRows => sheetRows.forEach(sheetRow => delete sheetRow.content)),
      tap(sheetRows => sheetRows.forEach(sheetRow => DomainHelper.adapt(PageDatabase.AddUpdateResult, sheetRow))),
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

  remove(page: Page) {
    const colsToReturn = ['version', 'rowNum'];

    const selectClause = this.getSelectClause(colsToReturn);
    const labelClause = this.getLabelClause(colsToReturn);
    const whereClause = `where ${this.pageColMapping.id} = ${page.id}`;

    const query = `${selectClause} ${whereClause} ${labelClause}`;

    return this.sheetQuery.execute(this.spreadsheetUrl, query, this.sheetName).pipe(
      switchMap((qr: any[]) => this.ensureLatestCopy(qr[0], page)),
      map(qr => GoogleSpreadsheet.DimensionRange.Create(this.sheetId, GoogleSpreadsheet.Dimension.ROWS, qr.RowNum - 1)),
      map(dimensionRange => GoogleSpreadsheet.DeleteDimensionRequest.Create(dimensionRange)),
      map(deleteDimensionRequest => GoogleSpreadsheet.BatchUpdateRequest.Create(deleteDimensionRequest)),
      switchMap(batchUpdateRequest => this.sheetBatchUpdateCommand.execute(this.spreadsheetId, [batchUpdateRequest])),
      switchMap(batchUpdateResponse => EMPTY)
    );
  }

  private getSelectClause(cols: string[]) {
    return `select ${cols.map(c => this.pageColMapping[c]).join(', ')}`;
  }

  private getLabelClause(cols: string[]) {
    return `label ${cols.map(c => `${this.pageColMapping[c]} '${c}'`).join(', ')}`;
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
    const headerCols = Object.keys(this.pageColMapping).map(x => GoogleSpreadsheet.CellData.Create(x));
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
    const cols = Object.keys(this.pageColMapping).map(propName => {
      if (propName === 'rowNum') {
        const cell = new GoogleSpreadsheet.CellData();
        cell.userEnteredValue = new GoogleSpreadsheet.ExtendedValue();
        cell.userEnteredValue.formulaValue = '=ROW()';
        return cell;
      }

      return GoogleSpreadsheet.CellData.Create(page[propName]);
    });

    return GoogleSpreadsheet.RowData.Create(cols);
  }
}

class SheetRow extends Page {
  rowNum = 0;
}
