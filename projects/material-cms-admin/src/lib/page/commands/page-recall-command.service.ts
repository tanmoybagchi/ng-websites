import { Inject, Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { Page, PAGE_DATABASE, PageDatabase } from 'material-cms-view';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PageRecallCommand {
  constructor(
    @Inject(PAGE_DATABASE) private pageDatabase: PageDatabase
  ) { }

  execute(model: Page, forceRecall: boolean) {
    model.status = 'Recalled';

    return this.pageDatabase.update(model).pipe(
      map(x => DomainHelper.adapt(PageRecallResult, x))
    );
  }
}

export class PageRecallResult {
  status = '';
  savedBy = '';
  @Reflect.metadata('design:type', Date)
  savedOn: Date = null;
  version = 0;
}
