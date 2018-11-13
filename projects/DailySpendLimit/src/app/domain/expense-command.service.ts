import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { DriveFileSearchQuery, DriveMimeTypes, GoogleSpreadsheet, SheetBatchUpdateCommand, SheetReadQuery } from 'gapi';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ExpenseCommand {
  private sheetId: number = null;

  constructor(
    private driveFileSearchQuery: DriveFileSearchQuery,
    private sheetReadQuery: SheetReadQuery,
    private sheetBatchUpdateCommand: SheetBatchUpdateCommand,
  ) { }

  execute(amt: number) {
    return this.driveFileSearchQuery.execute(environment.database, DriveMimeTypes.Spreadsheet, true).pipe(
      switchMap(searchResult => this.sheetId === null
        ? this.getSheetId(searchResult[0].id, amt)
        : this.updateSpreadsheet(searchResult[0].id, amt))
    );
  }

  private getSheetId(spreadsheetId: string, amt: number) {
    return this.sheetReadQuery.execute(spreadsheetId, 'Expenses', 'sheets(properties/sheetId)').pipe(
      tap(spreadsheet => this.sheetId = spreadsheet.sheets[0].properties.sheetId),
      switchMap(_ => this.updateSpreadsheet(spreadsheetId, amt))
    );
  }

  private updateSpreadsheet(spreadsheetId: string, amt: number) {
    const amtCell = GoogleSpreadsheet.CellData.Create(amt);
    amtCell.userEnteredFormat = GoogleSpreadsheet.CellFormat.Create(GoogleSpreadsheet.NumberFormatType.CURRENCY);

    const expenseRow = GoogleSpreadsheet.RowData.Create([
      GoogleSpreadsheet.CellData.Create(new Date()),
      amtCell
    ]);

    const request = GoogleSpreadsheet.AppendCellsRequest.Create(this.sheetId, [expenseRow]);

    const bur = GoogleSpreadsheet.BatchUpdateRequest.Create(request);

    return this.sheetBatchUpdateCommand.execute(spreadsheetId, [bur]);
  }
}
