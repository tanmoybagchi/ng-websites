import { Injectable } from '@angular/core';
import { DriveFileSearchQuery, DriveMimeTypes, GoogleSpreadsheet, SheetBatchUpdateCommand, SheetCreateCommand, SheetReadQuery } from 'gapi';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Config } from './config';

@Injectable({ providedIn: 'root' })
export class ConfigCommand {
  private sheetId: number = null;

  constructor(
    private driveFileSearchQuery: DriveFileSearchQuery,
    private sheetBatchUpdateCommand: SheetBatchUpdateCommand,
    private sheetCreateCommand: SheetCreateCommand,
    private sheetReadQuery: SheetReadQuery,
  ) { }

  execute(model: Config) {
    return this.driveFileSearchQuery.execute(environment.database, undefined, DriveMimeTypes.Spreadsheet, true).pipe(
      switchMap(searchResult => searchResult.length === 0
        ? this.createSpreadsheet(model)
        : this.sheetId === null
          ? this.getSheetId(searchResult[0].id, model)
          : this.updateSpreadsheet(searchResult[0].id, model))
    );
  }

  private getSheetId(spreadsheetId: string, model: Config) {
    return this.sheetReadQuery.execute(spreadsheetId, 'Config', 'sheets(properties/sheetId)').pipe(
      tap(spreadsheet => this.sheetId = spreadsheet.sheets[0].properties.sheetId),
      switchMap(_ => this.updateSpreadsheet(spreadsheetId, model))
    );
  }

  private updateSpreadsheet(spreadsheetId: string, model: Config) {
    const dailyLimitRow = GoogleSpreadsheet.RowData.Create([
      GoogleSpreadsheet.CellData.Create(model.dailyLimit)
    ]);

    const effectiveFromRow = GoogleSpreadsheet.RowData.Create([
      GoogleSpreadsheet.CellData.Create(model.effectiveFrom)
    ]);

    const request = GoogleSpreadsheet.UpdateCellsRequest.Create([dailyLimitRow, effectiveFromRow]);

    request.range = GoogleSpreadsheet.GridRange.Create(this.sheetId);
    request.range.startRowIndex = 0;
    request.range.startColumnIndex = 1;

    const bur = GoogleSpreadsheet.BatchUpdateRequest.Create(request);

    return this.sheetBatchUpdateCommand.execute(spreadsheetId, [bur]);
  }

  private createSpreadsheet(model: Config) {
    const spreadsheet = GoogleSpreadsheet.Create(environment.database);
    spreadsheet.sheets = [
      this.CreateConfigSheet(model),
      this.CreateExpensesSheet()
    ];
    return this.sheetCreateCommand.execute(spreadsheet);
  }

  private CreateConfigSheet(model: Config) {
    const dailyLimitRow = GoogleSpreadsheet.RowData.Create([
      GoogleSpreadsheet.CellData.Create('dailyLimit'),
      GoogleSpreadsheet.CellData.Create(model.dailyLimit)
    ]);

    const effectiveFromRow = GoogleSpreadsheet.RowData.Create([
      GoogleSpreadsheet.CellData.Create('effectiveFrom'),
      GoogleSpreadsheet.CellData.Create(model.effectiveFrom)
    ]);

    const configGrid = GoogleSpreadsheet.GridData.Create([dailyLimitRow, effectiveFromRow]);
    const configSheet = GoogleSpreadsheet.Sheet.Create('Config', [configGrid]);

    return configSheet;
  }

  private CreateExpensesSheet() {
    const row = GoogleSpreadsheet.RowData.Create([
      GoogleSpreadsheet.CellData.Create('On'),
      GoogleSpreadsheet.CellData.Create('Amt')
    ]);

    const grid = GoogleSpreadsheet.GridData.Create([row]);
    const sheet = GoogleSpreadsheet.Sheet.Create('Expenses', [grid]);
    sheet.properties.gridProperties = new GoogleSpreadsheet.GridProperties();
    sheet.properties.gridProperties.frozenRowCount = 1;

    return sheet;
  }
}
