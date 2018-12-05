import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '@app/domain/config';
import { ConfigCommand } from '@app/domain/config-command.service';
import { ConfigQuery } from '@app/domain/config-query.service';
import { ConfigRules } from '@app/domain/config-rules';
import { EventManagerService, Result } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { EMPTY } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './setup-daily-limit.component.html'
})
export class SetupDailyLimitComponent implements OnInit {
  errors: any;
  model: Config;

  constructor(
    private eventManagerService: EventManagerService,
    private configCommand: ConfigCommand,
    private configQuery: ConfigQuery,
    private configRules: ConfigRules,
    private router: Router,
  ) {
    this.model = new Config();
  }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.configQuery.execute().pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.ConfigQuery(_));
  }

  private ConfigQuery(queryResult: Config) {
    this.model = queryResult;
  }

  onSubmit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.configRules.check(this.model).pipe(
      switchMap(_ => this.configCommand.execute(this.model)),
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.onConfigCommand());
  }

  private onConfigCommand() {
    this.router.navigate(['setup/permissions']);
  }

  private onError(result: Result) {
    this.errors = result.errors;

    return EMPTY;
  }
}
