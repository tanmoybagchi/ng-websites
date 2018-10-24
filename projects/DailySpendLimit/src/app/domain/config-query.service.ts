import { Injectable } from '@angular/core';
import { DriveFileSearchQuery, DriveFileQuery } from 'gapi';
import { environment } from '../../environments/environment';
import { switchMap, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Result, DomainHelper } from 'core';
import { Config } from './models';

@Injectable({
  providedIn: 'root'
})
export class ConfigQuery {
  constructor(
    private driveFileSearchQuery: DriveFileSearchQuery,
    private driveFileQuery: DriveFileQuery
  ) { }

  execute() {
    return this.driveFileSearchQuery.execute(environment.rootFolder, null, DriveFileSearchQuery.DriveMimeTypes.Folder, true).pipe(
      switchMap(result => result.length === 0 ?
        throwError(Result.CreateErrorResult('DatabaseNotFound')) :
        this.driveFileSearchQuery.execute(environment.database, result[0].id, DriveFileSearchQuery.DriveMimeTypes.File, true).pipe(
          switchMap(result => result.length === 0 ?
            throwError(Result.CreateErrorResult('DatabaseNotFound')) :
            this.driveFileQuery.execute(result[0].id).pipe(
              map(_ => DomainHelper.adapt(Config, _))
            )
          )
        )
      )
    );
  }
}
