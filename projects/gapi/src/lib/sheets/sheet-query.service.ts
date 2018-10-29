import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Result } from 'core';
import { throwError, of } from 'rxjs';
import { GoogleSpreadsheet } from './google-spreadsheet';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SheetQuery {
  constructor(
    private httpClient: HttpClient
  ) { }

  execute(spreadsheetUrl: string, query: string, sheetName?: string, range?: string) {
    if (String.isNullOrWhitespace(spreadsheetUrl)) {
      return throwError(Result.CreateErrorResult('Required', 'spreadsheetUrl'));
    }

    if (String.isNullOrWhitespace(query)) {
      return throwError(Result.CreateErrorResult('Required', 'query'));
    }

    let params = new HttpParams().append('tq', query);
    // tslint:disable-next-line:no-unused-expression
    String.hasData(sheetName) && (params = params.append('sheet', sheetName));
    // tslint:disable-next-line:no-unused-expression
    String.hasData(range) && (params = params.append('range', range));
    params = params.append('tqx', 'out:json');

    return this.httpClient.get<GoogleSpreadsheet>(`${spreadsheetUrl}/gviz/tq`, { params: params }).pipe(
      catchError((httpError: HttpErrorResponse) => {
        const text_response = <string>httpError.error.text;
        const brace_start = text_response.indexOf('{');
        const brace_end = text_response.lastIndexOf('}');

        const json_response = JSON.parse(text_response.slice(brace_start, brace_end + 1));

        if (json_response.status === 'error') {
          return throwError(Result.CreateErrorResult(json_response.errors[0].detailed_message));
        }

        const response = [];

        for (let rowIdx = 0; rowIdx < json_response.table.rows.length; rowIdx++) {
          const row = json_response.table.rows[rowIdx];

          const x = {};

          for (let cellIdx = 0; cellIdx < row.c.length; cellIdx++) {
            const cell = row.c[cellIdx];

            const col = json_response.table.cols[cellIdx];

            x[(col.label || col.id).trim()] = cell.v;
          }

          response.push(x);
        }

        return of(response);
      })
    );
  }
}
