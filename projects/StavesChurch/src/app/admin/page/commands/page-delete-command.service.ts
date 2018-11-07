import { Injectable } from '@angular/core';
import { AdminModule } from '@app/admin/admin.module';
import { DomainHelper } from 'core';
import { map } from 'rxjs/operators';
import { AdminPageDatabase } from '../../admin-page-database';
import { Page } from '../page';

@Injectable({ providedIn: AdminModule })
export class PageDeleteCommand {
  constructor(
    private pageDatabase: AdminPageDatabase
  ) { }

  execute(model: Page) {
    model.status = 'Deleted';

    return this.pageDatabase.update(model).pipe(
      map(x => DomainHelper.adapt(PageDeleteResult, x))
    );
  }
}

export class PageDeleteResult {
  status = '';
  savedBy = '';
  @Reflect.metadata('design:type', Date)
  savedOn: Date = null;
  version = 0;
}
