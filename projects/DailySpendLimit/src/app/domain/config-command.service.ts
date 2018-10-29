import { Injectable } from '@angular/core';
import { SessionStorageService } from 'core';
import { DriveSaveCommand, DriveFileSearchQuery } from 'gapi';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Config } from './config';

@Injectable({ providedIn: 'root' })
export class ConfigCommand {
  constructor(
    private driveFileSearchQuery: DriveFileSearchQuery,
    private driveSaveCommand: DriveSaveCommand,
    private storage: SessionStorageService,
  ) { }

  execute(model: Config) {
    const id = <string>this.storage.get('optionsId');

    if (String.hasData(id)) {
      return this.driveSaveCommand.execute(model, id);
    }

    return this.driveSaveCommand.execute(model, undefined, environment.config).pipe(
      tap(result => this.storage.set('optionsId', result.id))
    );
  }
}
