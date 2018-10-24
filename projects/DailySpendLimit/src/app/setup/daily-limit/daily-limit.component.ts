import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventManagerService, Result } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ConfigQuery } from '../../domain/config-query.service';
import { Config } from '../../domain/models';

@Component({
  selector: 'app-daily-limit',
  templateUrl: './daily-limit.component.html',
  styleUrls: ['./daily-limit.component.scss']
})
export class DailyLimitComponent implements OnInit {
  errors: any;
  model: Config;

  constructor(
    private eventManagerService: EventManagerService,
    private configQuery: ConfigQuery,
    private router: Router,
  ) {
    this.model = new Config();
  }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.configQuery.execute().pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.onDailyLimitQuery(_));
  }

  private onDailyLimitQuery(queryResult: Config) {
    this.model = queryResult;
  }

  onSubmit() {
  }

  private onError(result: Result) {
    if (result.errors.general && !result.errors.general.databaseNotFound) {
      this.errors = result.errors;
    }

    return EMPTY;
  }
}
