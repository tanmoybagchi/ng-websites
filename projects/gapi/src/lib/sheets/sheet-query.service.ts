import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleSpreadsheet } from './google-spreadsheet';

@Injectable({ providedIn: 'root' })
export class SheetQuery {
  constructor(
    private httpClient: HttpClient
  ) { }

  execute(spreadsheetId: string, sheet = 'Sheet1', fields = 'sheets(data(rowData(values/formattedValue)))') {
    let params = new HttpParams();

    if (String.hasData(sheet)) { params = params.append('ranges', sheet); }
    if (String.hasData(fields)) { params = params.append('fields', fields); }

    return this.httpClient.get<GoogleSpreadsheet>(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, { params: params });
  }
}
