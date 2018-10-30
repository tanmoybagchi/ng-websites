import { Injectable } from '@angular/core';
import { DriveFileSearchQuery, DriveSaveCommand } from 'gapi';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Config } from './config';

@Injectable({ providedIn: 'root' })
export class ConfigCommand {
  constructor(
    private driveFileSearchQuery: DriveFileSearchQuery,
    private driveSaveCommand: DriveSaveCommand,
  ) { }

  execute(model: Config) {
    return this.driveFileSearchQuery.execute(environment.database, undefined, undefined, true).pipe(
      switchMap(searchResult => searchResult.length === 0
        ? this.driveSaveCommand.execute(model, undefined, environment.database)
        : this.driveSaveCommand.execute(model, searchResult[0].id)
      )
    );
  }
}
