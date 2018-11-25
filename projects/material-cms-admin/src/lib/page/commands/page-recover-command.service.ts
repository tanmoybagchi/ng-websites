import { Inject, Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { Page } from 'material-cms-view';
import { map } from 'rxjs/operators';
import { AdminPageDatabase, ADMIN_PAGE_DATABASE } from '../../admin-page-database';

@Injectable({ providedIn: 'root' })
export class PageRecoverCommand {
  constructor(
    @Inject(ADMIN_PAGE_DATABASE) private pageDatabase: AdminPageDatabase
  ) { }

  execute(model: Page) {
    model.status = 'Draft';

    return this.pageDatabase.update(model).pipe(
      map(x => DomainHelper.adapt(PageRecoverResult, x))
    );
  }
}

export class PageRecoverResult {
  status = '';
  savedBy = '';
  @Reflect.metadata('design:type', Date)
  savedOn: Date = null;
  version = 0;
}
