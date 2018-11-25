import { Inject, Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { Page, PAGE_DATABASE, PageDatabase } from 'material-cms-view';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PageRecoverCommand {
  constructor(
    @Inject(PAGE_DATABASE) private pageDatabase: PageDatabase
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
