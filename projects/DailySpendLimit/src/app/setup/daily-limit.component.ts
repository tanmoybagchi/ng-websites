import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventManagerService, Result } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY, of } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { Config } from '../domain/config';
import { ConfigCommand } from '../domain/config-command.service';
import { ConfigQuery } from '../domain/config-query.service';
import { ConfigRules } from '../domain/config-rules';
import { DriveCreateCommand, DriveMimeTypes } from 'gapi';
import { environment } from '../../environments/environment';

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
    private configRules: ConfigRules,
    private driveCreateCommand: DriveCreateCommand,
    private router: Router,
  ) {
    this.model = new Config();
  }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

/*     this.configQuery.execute().pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.onConfigQuery(_));
 */  }

  private onConfigQuery(queryResult: Config) {
    this.model = queryResult;
  }

  onSubmit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.configRules.check(this.model).pipe(
      switchMap(_ => {
        if (String.hasData(this.model.spreadsheetId)) {
          return of({});
        }

        return this.driveCreateCommand.execute(environment.database, DriveMimeTypes.Spreadsheet).pipe(
          tap(result => this.model.spreadsheetId = result.id),
        );
      }),
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
