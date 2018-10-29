import { Injectable } from '@angular/core';
import { DriveFileSearchQuery, DriveSaveCommand, SheetCreateCommand, GoogleSpreadsheet, DriveMimeTypes } from 'gapi';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Config } from './config';
import { SheetBatchUpdateCommand } from 'projects/gapi/src/lib/sheets/sheet-batchUpdate-command.service';

@Injectable({ providedIn: 'root' })
export class ConfigCommand {
  constructor(
    private driveFileSearchQuery: DriveFileSearchQuery,
    private driveSaveCommand: DriveSaveCommand,
    private sheetCreateCommand: SheetCreateCommand,
    private sheetBatchUpdateCommand: SheetBatchUpdateCommand,
  ) { }

  execute(model: Config) {
    return this.driveFileSearchQuery.execute(environment.database, undefined, DriveMimeTypes.Spreadsheet).pipe(
      switchMap(searchResult => searchResult.length === 1 ?
        this.updateSpreadsheet(searchResult[0].id, model) :
        this.createSpreadsheet(model))
    );
  }

  private updateSpreadsheet(spreadsheetId: string, model: Config) {
    const spreadsheet = GoogleSpreadsheet.Create(environment.database);
    spreadsheet.sheets = [
      this.CreateConfigSheet(model),
      this.CreateExpensesSheet()
    ];
    return this.sheetBatchUpdateCommand.execute(spreadsheetId, []);
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
