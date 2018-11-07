import { Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { map } from 'rxjs/operators';
import { AdminPageDatabase } from '../../admin-page-database';
import { AdminModule } from '../../admin.module';
import { Page } from '../page';

@Injectable({ providedIn: AdminModule })
export class PageChangeCommand {
  constructor(
    private pageDatabase: AdminPageDatabase,
  ) { }

  execute(model: Page) {
    const create = model.status === 'Approved' && model.effectiveFrom.valueOf() <= Date.now();

    model.status = 'Draft';
    const obs = create ? this.pageDatabase.add(model) : this.pageDatabase.update(model);

    return obs.pipe(
      map(x => DomainHelper.adapt(PageChangeResult, x))
    );
  }
}

export class PageChangeResult {
  id = 0;
  status = '';
  savedBy = '';
  @Reflect.metadata('design:type', Date)
  savedOn: Date = null;
  version = 0;
}
