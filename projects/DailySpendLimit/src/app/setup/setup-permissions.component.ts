import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { EventManagerService, Result } from 'core';
import { DriveFileSearchQuery, DrivePermission, DrivePermissionsCreateCommand, DrivePermissionsQuery } from 'gapi';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';

@Component({
  templateUrl: './setup-permissions.component.html'
})
export class SetupPermissionsComponent implements OnInit {
  errors: any;
  model: any;
  email = '';
  fileId: string;

  constructor(
    private driveFileSearchQuery: DriveFileSearchQuery,
    private drivePermissionsCreateCommand: DrivePermissionsCreateCommand,
    private drivePermissionsQuery: DrivePermissionsQuery,
    private eventManagerService: EventManagerService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.driveFileSearchQuery.execute(environment.database, undefined, true).pipe(
      tap(result => this.fileId = result[0].id),
      switchMap(_ => this.drivePermissionsQuery.execute(this.fileId)),
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.onPermissionsQuery(_));
  }

  private onPermissionsQuery(queryResult: any) {
    this.model = queryResult;
  }

  onSubmit() {
    if (String.isNullOrWhitespace(this.email)) {
      this.router.navigate(['dashboard']);
      return;
    }

    this.eventManagerService.raise(ShowThrobberEvent);

    this.drivePermissionsCreateCommand.execute(this.fileId, this.email, DrivePermission.Roles.writer).pipe(
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
