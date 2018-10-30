import { Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { DriveFileReadQuery, DriveFileSearchQuery } from 'gapi';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Config } from './config';

@Injectable({
  providedIn: 'root'
})
export class ConfigQuery {
  constructor(
    private driveFileSearchQuery: DriveFileSearchQuery,
    private driveFileReadQuery: DriveFileReadQuery,
  ) { }

  execute() {
    return this.driveFileSearchQuery.execute(environment.database, undefined, undefined, true).pipe(
      switchMap(searchResult => searchResult.length === 0
        ? of({})
        : this.driveFileReadQuery.execute(searchResult[0].id)
      ),
      map(_ => DomainHelper.adapt(Config, _))
    );
  }
}
