import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { DomainHelper, SessionStorageService } from 'core';
import { DriveFileSearchQuery, DriveMimeTypes, SheetReadQuery } from 'gapi';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Config } from './config';

@Injectable({
  providedIn: 'root'
})
export class ConfigQuery {
  constructor(
    private driveFileSearchQuery: DriveFileSearchQuery,
    private sheetReadQuery: SheetReadQuery,
    private storage: SessionStorageService
  ) { }

  execute() {
    let config = this.storage.get('config');
    if (config) {
      return of(DomainHelper.adapt(Config, config));
    }

    return this.driveFileSearchQuery.execute(environment.database, DriveMimeTypes.Spreadsheet, true).pipe(
      switchMap(searchResult => {
        if (searchResult.length === 0) { return of(new Config()); }

        // tslint:disable-next-line:max-line-length
        return this.sheetReadQuery.execute(searchResult[0].id, 'Config', 'spreadsheetUrl,sheets(data(rowData(values/effectiveValue,values/formattedValue)))').pipe(
          map(spreadsheet => {
            config = new Config();

            config.spreadsheetUrl = spreadsheet.spreadsheetUrl.replace('/edit', '');
            config.dailyLimit = spreadsheet.sheets[0].data[0].rowData[0].values[1].effectiveValue.numberValue;
            config.effectiveFrom = new Date(spreadsheet.sheets[0].data[0].rowData[1].values[1].formattedValue);

            this.storage.set('config', config);

            return config;
          })
        );
      })
    );
  }
}
