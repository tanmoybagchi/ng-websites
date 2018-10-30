import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventManagerService, Result } from 'core';
import { DriveFileSearchQuery, DrivePermissionsReadQuery } from 'gapi';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { DrivePermissionsCreateCommand } from 'gapi';
import { EMPTY } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Component({
  templateUrl: './setup-permissions.component.html'
})
export class SetupPermissionsComponent implements OnInit {
  errors: any;
  model: any;
  email = '';
  fileId: string;

  constructor(
    private eventManagerService: EventManagerService,
    private router: Router,
    private drivePermissionsReadQuery: DrivePermissionsReadQuery,
    private drivePermissionsCreateCommand: DrivePermissionsCreateCommand,
    private driveFileSearchQuery: DriveFileSearchQuery,
  ) { }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.driveFileSearchQuery.execute(environment.database, undefined, undefined, true).pipe(
      tap(result => this.fileId = result[0].id),
      switchMap(_ => this.drivePermissionsReadQuery.execute(this.fileId)),
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.PermissionsQuery(_));
  }

  private PermissionsQuery(queryResult: any) {
    this.model = queryResult;
  }

  onSubmit() {
    if (String.isNullOrWhitespace(this.email)) {
      return;
    }

    this.eventManagerService.raise(ShowThrobberEvent);

    this.drivePermissionsCreateCommand.execute(this.fileId, this.email, DrivePermissionsCreateCommand.Roles.writer).pipe(
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.onPermissionsCommand());
  }

  private onPermissionsCommand() {
    this.router.navigate(['dashboard']);
  }

  private onError(result: Result) {
    this.errors = result.errors;

    return EMPTY;
  }
}
