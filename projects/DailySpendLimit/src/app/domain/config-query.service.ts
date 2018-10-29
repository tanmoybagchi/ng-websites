import { Injectable } from '@angular/core';
import { DriveFileSearchQuery, DriveMimeTypes, GoogleSpreadsheet, SheetReadQuery } from 'gapi';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Config } from './config';

@Injectable({
  providedIn: 'root'
})
export class ConfigQuery {
  constructor(
    private driveFileSearchQuery: DriveFileSearchQuery,
    private sheetReadQuery: SheetReadQuery,
  ) { }

  execute() {
    // return this.sheetQuery.execute('https://docs.google.com/spreadsheets/d/1wktik_OTkJvN7jMqNXTVrTi0uB2T12DG4vj3nUefmZY', 'select sum(B)', 'Expenses');

    return this.driveFileSearchQuery.execute(environment.database, undefined, DriveMimeTypes.Spreadsheet, true).pipe(
      switchMap(result => {
        if (result.length === 0) { return of(new Config()); }

        return this.sheetReadQuery.execute(result[0].id, 'Config', 'sheets(data(rowData(values/effectiveValue)))').pipe(
          map((result: GoogleSpreadsheet) => {
            const model = new Config();

            model.dailyLimit = result.sheets[0].data[0].rowData[1].values[0].effectiveValue.numberValue;
            model.effectiveFrom = new Date(result.sheets[0].data[0].rowData[1].values[1].effectiveValue.stringValue);

            return model;
          })
        );
      })
    );
  }
}
