import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventManagerService, Result } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Config } from '../domain/config';
import { ConfigCommand } from '../domain/config-command.service';
import { ConfigQuery } from '../domain/config-query.service';

@Component({
  templateUrl: './daily-limit.component.html'
})
export class DailyLimitComponent implements OnInit {
  errors: any;
  model: Config;

  constructor(
    private eventManagerService: EventManagerService,
    private configQuery: ConfigQuery,
    private configCommand: ConfigCommand,
    private router: Router,
  ) {
    this.model = new Config();
  }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.configQuery.execute().pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.onConfigQuery(_));
  }

  private onConfigQuery(queryResult: Config) {
    this.model = queryResult;
  }

  onSubmit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.configCommand.execute(this.model).pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.onConfigCommand());
  }

  private onConfigCommand() {
    this.router.navigate(['setup/permissions']);
  }

  private onError(result: Result) {
    if (result.errors.general && (result.errors.general.notFound || result.errors.general.databaseNotFound)) {
      return EMPTY;
    }

    this.errors = result.errors;

    return EMPTY;
  }
}
