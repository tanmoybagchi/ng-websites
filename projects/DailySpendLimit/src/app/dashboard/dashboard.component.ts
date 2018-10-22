import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventManagerService, Result } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { DailyLimitQuery } from './daily-limit-query.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  errors: any;

  constructor(
    private eventManagerService: EventManagerService,
    private dailyLimitQuery: DailyLimitQuery,
    private router: Router,
  ) { }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.dailyLimitQuery.execute().pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.onDailyLimitQuery(_));
  }

  private onDailyLimitQuery(queryResult: any) {
  }

  private onError(result: Result) {
    if (result.errors.general && result.errors.general.databaseNotFound) {
      this.router.navigate(['setup']);
    } else {
      this.errors = result.errors;
    }

    return EMPTY;
  }
}
