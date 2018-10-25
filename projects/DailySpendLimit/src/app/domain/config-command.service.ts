import { Injectable } from '@angular/core';
import { DriveMimeTypes, DriveSaveCommand } from 'gapi';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Config } from './config';
import { ConfigRules } from './config-rules';

@Injectable({ providedIn: 'root' })
export class ConfigCommand {
  constructor(
    private configRules: ConfigRules,
    private driveSaveCommand: DriveSaveCommand
  ) { }

  execute(model: Config) {
    return this.configRules.check(model).pipe(
      switchMap(_ => this.driveSaveCommand.execute(model, null, environment.database))
    );
  }
}
