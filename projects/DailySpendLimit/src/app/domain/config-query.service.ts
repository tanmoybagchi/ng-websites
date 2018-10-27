import { Injectable } from '@angular/core';
import { SheetQuery } from 'gapi';

@Injectable({
  providedIn: 'root'
})
export class ConfigQuery {
  constructor(
    private sheetQuery: SheetQuery
  ) { }

  execute() {
    return this.sheetQuery.execute('https://docs.google.com/spreadsheets/d/1wktik_OTkJvN7jMqNXTVrTi0uB2T12DG4vj3nUefmZY', 'select sum(B)', 'Expenses');
  }
}
