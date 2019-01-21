import { Component, OnInit } from '@angular/core';
import { Result } from 'core';
import { EMPTY } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AboutUsCurrentQuery } from './about-us-current-query.service';

@Component({
  selector: 'vtw-about-us-summary',
  templateUrl: './about-us-summary.component.html'
})
export class AboutUsSummaryComponent implements OnInit {
  errors: any;
  model = '';
  waiting = true;

  constructor(
    private currentQuery: AboutUsCurrentQuery,
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
