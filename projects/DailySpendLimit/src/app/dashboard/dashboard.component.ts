import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventManagerService, Result } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ConfigQuery } from '../domain/config-query.service';
import { Config } from '../domain/config';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  errors: any;

  constructor(
    private eventManagerService: EventManagerService,
    private configQuery: ConfigQuery,
    private router: Router,
  ) { }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.configQuery.execute().pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.onDailyLimitQuery(_));
  }

  private onDailyLimitQuery(config: Config) {
    if (config.effectiveFrom == null || String.isNullOrWhitespace(config.spreadsheetId)) {
      this.router.navigate(['setup']);
      return;
    }
  }

  private onError(result: Result) {
    console.log(result);
    if (result.errors.general && (result.errors.general.notFound || result.errors.general.databaseNotFound)) {
      this.router.navigate(['setup']);
    } else {
      this.errors = result.errors;
    }

    return EMPTY;
  }
}
