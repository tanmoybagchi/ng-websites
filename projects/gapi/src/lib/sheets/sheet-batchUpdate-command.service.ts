import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleSpreadsheet } from './google-spreadsheet';

@Injectable({ providedIn: 'root' })
export class SheetBatchUpdateCommand {
  constructor(
    private http: HttpClient
  ) { }

  execute(spreadsheetId: string, updates: GoogleSpreadsheet.BatchUpdateRequest[]) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;

    const body = {
      requests: updates,
      includeSpreadsheetInResponse: false,
      responseIncludeGridData: false
    };

    return this.http.post<GoogleSpreadsheet>(url, body);
  }
}
