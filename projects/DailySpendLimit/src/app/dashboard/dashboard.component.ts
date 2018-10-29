import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventManagerService, Result } from 'core';
import { DriveFileSearchQuery, DriveMimeTypes } from 'gapi';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  errors: any;

  constructor(
    private eventManagerService: EventManagerService,
    private driveFileSearchQuery: DriveFileSearchQuery,
    private router: Router,
  ) { }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.driveFileSearchQuery.execute(environment.database, undefined, DriveMimeTypes.Spreadsheet, true).pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.onDriveFileSearchQuery(_));
  }

  private onDriveFileSearchQuery(result: DriveFileSearchQuery.Result[]) {
    if (result.length === 0) {
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
