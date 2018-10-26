import { Injectable } from '@angular/core';
import { DomainHelper, Result, SessionStorageService } from 'core';
import { DriveFileQuery, DriveFileSearchQuery } from 'gapi';
import { throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Config } from './config';

@Injectable({
  providedIn: 'root'
})
export class ConfigQuery {
  constructor(
    private driveFileQuery: DriveFileQuery,
    private driveFileSearchQuery: DriveFileSearchQuery,
    private sessionStorageService: SessionStorageService,
  ) { }

  execute() {
    return this.driveFileSearchQuery.execute(environment.database).pipe(
      switchMap(result => {
        if (result.length === 0) {
          return throwError(Result.CreateErrorResult('DatabaseNotFound'));
        }

        this.sessionStorageService.set('optionsId', result[0].id);

        return this.driveFileQuery.execute(result[0].id).pipe(
          map(_ => DomainHelper.adapt(Config, _))
        );
      })
    );
  }
}
