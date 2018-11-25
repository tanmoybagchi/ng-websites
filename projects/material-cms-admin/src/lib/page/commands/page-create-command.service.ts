import { Inject, Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { Page } from 'material-cms-view';
import { map } from 'rxjs/operators';
import { AdminPageDatabase, ADMIN_PAGE_DATABASE } from '../../admin-page-database';

@Injectable({ providedIn: 'root' })
export class PageCreateCommand {
  constructor(
    @Inject(ADMIN_PAGE_DATABASE) private pageDatabase: AdminPageDatabase
  ) { }

  execute(kind: string) {
    const model = new Page();
    model.kind = kind;

    return this.pageDatabase.add(model).pipe(
      map(x => DomainHelper.adapt(PageCreateResult, x))
    );
  }
}

export class PageCreateResult {
  id = 0;
  identifier = '';
  status = '';
  savedBy = '';
  @Reflect.metadata('design:type', Date)
  savedOn: Date = null;
  version = 0;
}
