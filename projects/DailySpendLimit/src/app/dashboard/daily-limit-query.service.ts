import { Injectable } from '@angular/core';
import { Result } from 'core';
import { DriveFileQuery, DriveFileSearchQuery } from 'gapi';
import { throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DailyLimitQuery {
  constructor(
    private driveFileSearchQuery: DriveFileSearchQuery,
    private driveFileQuery: DriveFileQuery
  ) { }

  execute() {
    return this.driveFileSearchQuery.execute(environment.database).pipe(
      switchMap(result => result.length === 0 ?
        throwError(Result.CreateErrorResult('DatabaseNotFound')) :
        this.driveFileQuery.execute(result[0].id))
    );
  }
}
