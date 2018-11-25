import { Inject, Injectable } from '@angular/core';
import { DomainHelper, Result } from 'core';
import { Page } from 'material-cms-view';
import { throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AdminPageDatabase, ADMIN_PAGE_DATABASE } from '../../admin-page-database';

@Injectable({ providedIn: 'root' })
export class PageApproveCommand {
  constructor(
    @Inject(ADMIN_PAGE_DATABASE) private pageDatabase: AdminPageDatabase
  ) { }

  execute(model: Page, allowMultipleActivePages = false) {
    const today = new Date();

    if (model.effectiveFrom.toDateString() === today.toDateString()) {
      model.effectiveFrom = today;
    } else {
      model.effectiveFrom.setHours(0, 0, 0, 0);
    }

    if (allowMultipleActivePages) {
      model.status = 'Approved';

      return this.pageDatabase.update(model).pipe(
        map(x => DomainHelper.adapt(PageApproveResult, x))
      );
    }

    return this.pageDatabase.get(model.kind).pipe(
      map(pages => pages.filter(page => page.status === 'Approved')),
      switchMap(_ => this.onPages(_, model))
    );
  }

  private onPages(pages: Page[], model: Page<string | {}>) {
    const overlappingPage = pages.find(page => page.effectiveFrom.valueOf() === model.effectiveFrom.valueOf());
    if (overlappingPage) {
      return throwError(Result.CreateErrorResult(`Cannot approve as it would overlap with ${overlappingPage.id}.`));
    }

    model.status = 'Approved';

    return this.pageDatabase.update(model).pipe(
      map(x => DomainHelper.adapt(PageApproveResult, x))
    );
  }
}

export class PageApproveResult {
  status = '';
  savedBy = '';
  @Reflect.metadata('design:type', Date)
  savedOn: Date = null;
  version = 0;
}
