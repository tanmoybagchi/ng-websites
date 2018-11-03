import { Injectable } from '@angular/core';
import { SheetQuery } from 'gapi';

@Injectable({
  providedIn: 'root'
})
export class ExpenseQuery {
  constructor(
    private sheetQuery: SheetQuery,
  ) { }

  execute(spreadsheetUrl: string) {
    const startOfMOnth = new Date();
    startOfMOnth.setDate(1);

    const param = `${startOfMOnth.getFullYear()}-${startOfMOnth.getMonth() + 1}-01`;

    return this.sheetQuery.execute(spreadsheetUrl, `select sum(B) where A >= date '${param}'`, 'Expenses');
  }
}
