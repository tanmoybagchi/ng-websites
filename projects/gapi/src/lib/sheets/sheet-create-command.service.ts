import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleSpreadsheet } from './google-spreadsheet';

@Injectable({ providedIn: 'root' })
export class SheetCreateCommand {
  constructor(
    private http: HttpClient
  ) { }

  execute(model: GoogleSpreadsheet) {
    return this.http.post<GoogleSpreadsheet>('https://sheets.googleapis.com/v4/spreadsheets', model);
  }
}
