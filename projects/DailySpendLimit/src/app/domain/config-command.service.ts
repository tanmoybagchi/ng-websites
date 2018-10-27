import { Injectable } from '@angular/core';
import { SessionStorageService } from 'core';
import { DriveSaveCommand } from 'gapi';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Config } from './config';
import { ConfigRules } from './config-rules';

@Injectable({ providedIn: 'root' })
export class ConfigCommand {
  constructor(
    private configRules: ConfigRules,
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
