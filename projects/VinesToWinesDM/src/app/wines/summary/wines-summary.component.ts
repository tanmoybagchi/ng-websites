import { Component, OnInit } from '@angular/core';
import { Result } from 'core';
import { EMPTY } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { WinesCurrentQuery } from '../wines-current-query.service';

@Component({
  selector: 'vtw-wines-summary',
  templateUrl: './wines-summary.component.html'
})
export class WinesSummaryComponent implements OnInit {
  errors: any;
  model = '';
  waiting = true;

  constructor(
    private currentQuery: WinesCurrentQuery,
  ) { }

  ngOnInit() {
    this.currentQuery.execute().pipe(
      tap(qr => this.model = qr.summary),
      catchError(err => this.onError(err)),
      finalize(() => this.waiting = false)
    ).subscribe();
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
