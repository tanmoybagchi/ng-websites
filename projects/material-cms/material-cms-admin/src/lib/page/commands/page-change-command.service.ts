import { Inject, Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { Page, PAGE_DATABASE, PageDatabase } from 'material-cms-view';
import { iif } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PageChangeCommand {
  constructor(
    @Inject(PAGE_DATABASE) private pageDatabase: PageDatabase
  ) { }

  execute(model: Page) {
    const create = model.status === 'Approved' && model.effectiveFrom.valueOf() <= Date.now();

    model.status = 'Draft';

    return iif(() => create, this.pageDatabase.add(model), this.pageDatabase.update(model)).pipe(
      map(x => DomainHelper.adapt(PageChangeResult, x))
    );

    /* const obs = create ? this.pageDatabase.add(model) : this.pageDatabase.update(model);

    return obs.pipe(
      map(x => DomainHelper.adapt(PageChangeResult, x))
    ); */
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
