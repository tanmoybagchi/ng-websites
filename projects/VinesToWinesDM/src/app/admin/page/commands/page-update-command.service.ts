import { Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { map } from 'rxjs/operators';
import { AdminPageDatabase } from '../../admin-page-database';
import { AdminModule } from '../../admin.module';
import { Page } from '../page';

@Injectable({ providedIn: AdminModule })
export class PageUpdateCommand {
  constructor(
    private pageDatabase: AdminPageDatabase
  ) { }

  execute(model: Page) {
    return this.pageDatabase.update(model).pipe(
      map(x => DomainHelper.adapt(PageUpdateResult, x))
    );
  }
}

export class PageUpdateResult {
  status = '';
  savedBy = '';
  @Reflect.metadata('design:type', Date)
  savedOn: Date = null;
  version = 0;
}
