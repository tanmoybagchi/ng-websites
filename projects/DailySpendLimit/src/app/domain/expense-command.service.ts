import { Injectable } from '@angular/core';
import { DriveFileSearchQuery, DriveMimeTypes, GoogleSpreadsheet, SheetBatchUpdateCommand, SheetReadQuery } from 'gapi';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExpenseCommand {
  private expenseSheetId: number = null;

  constructor(
    private driveFileSearchQuery: DriveFileSearchQuery,
    private sheetReadQuery: SheetReadQuery,
    private sheetBatchUpdateCommand: SheetBatchUpdateCommand,
  ) { }

  execute(amt: number) {
    return this.driveFileSearchQuery.execute(environment.database, undefined, DriveMimeTypes.Spreadsheet, true).pipe(
      switchMap(searchResult => this.expenseSheetId === null
        ? this.getExpenseSheetId(searchResult[0].id, amt)
        : this.updateSpreadsheet(searchResult[0].id, amt))
    );
  }

  private getExpenseSheetId(spreadsheetId: string, amt: number) {
    return this.sheetReadQuery.execute(spreadsheetId, 'Expenses', 'sheets(properties/sheetId)').pipe(
      tap(spreadsheet => this.expenseSheetId = spreadsheet.sheets[0].properties.sheetId),
      switchMap(_ => this.updateSpreadsheet(spreadsheetId, amt))
    );
  }

  private updateSpreadsheet(spreadsheetId: string, amt: number) {
    const expenseRow = GoogleSpreadsheet.RowData.Create([
      GoogleSpreadsheet.CellData.Create(new Date()),
      GoogleSpreadsheet.CellData.Create(amt)
    ]);

    const request = GoogleSpreadsheet.AppendCellsRequest.Create(this.expenseSheetId, [expenseRow]);

    const bur = GoogleSpreadsheet.BatchUpdateRequest.Create(request);

    return this.sheetBatchUpdateCommand.execute(spreadsheetId, [bur]);
  }
}
