import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Result } from 'core';
import { throwError } from 'rxjs';
import { GoogleSpreadsheet } from './google-spreadsheet';

@Injectable({ providedIn: 'root' })
export class SheetReadQuery {
  constructor(
    private httpClient: HttpClient
  ) { }

  execute(spreadsheetId: string, sheet: string, fields: string) {
    if (String.isNullOrWhitespace(spreadsheetId)) {
      return throwError(Result.CreateErrorResult('Required', 'spreadsheetId'));
    }

    let params = new HttpParams();

    if (String.hasData(sheet)) { params = params.append('ranges', sheet); }
    if (String.hasData(fields)) { params = params.append('fields', fields); }

    return this.httpClient.get<GoogleSpreadsheet>(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, { params: params });
  }
}
