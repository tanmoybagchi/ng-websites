import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventManagerService, Result } from 'core';
import { DriveCreateCommand, DriveMimeTypes, DriveFileSearchQuery, SheetReadQuery } from 'gapi';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY, of } from 'rxjs';
import { catchError, finalize, switchMap, tap, filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Config } from '../domain/config';
import { ConfigCommand } from '../domain/config-command.service';
import { ConfigRules } from '../domain/config-rules';
import { ConfigQuery } from '../domain/config-query.service';

@Component({
  templateUrl: './daily-limit.component.html'
})
export class DailyLimitComponent implements OnInit {
  errors: any;
  model: Config;

  constructor(
    private eventManagerService: EventManagerService,
    private configCommand: ConfigCommand,
    private configQuery: ConfigQuery,
    private configRules: ConfigRules,
    private driveFileSearchQuery: DriveFileSearchQuery,
    private driveCreateCommand: DriveCreateCommand,
    private sheetReadQuery: SheetReadQuery,
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
    console.log(queryResult);
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
    if (result.errors.general && (result.errors.general.notFound || result.errors.general.databaseNotFound)) {
      return EMPTY;
    }

    this.errors = result.errors;

    return EMPTY;
  }
}
