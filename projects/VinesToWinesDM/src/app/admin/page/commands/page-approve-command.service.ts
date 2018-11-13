import { Injectable } from '@angular/core';
import { DomainHelper, Result } from 'core';
import { throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AdminPageDatabase } from '../../admin-page-database';
import { AdminModule } from '../../admin.module';
import { Page } from '../page';

@Injectable({ providedIn: AdminModule })
export class PageApproveCommand {
  constructor(
    private pageDatabase: AdminPageDatabase
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
      // tslint:disable-next-line:max-line-length
      map(pages => pages.filter(page => page.status === 'Approved')),
      switchMap(_ => this.onPages(_, model))
    );
  }

  private onPages(pages: Page[], model: Page<string | {}>) {
    const overlappingPage = pages.find(page => page.effectiveFrom.valueOf() === model.effectiveFrom.valueOf());
    if (overlappingPage) {
      const result = new Result();
      result.addError(`Cannot approve as it would overlap with ${overlappingPage.id}.`);
      return throwError(result);
    }

    model.status = 'Approved';

    return this.pageDatabase.update(model).pipe(
      map(x => DomainHelper.adapt(PageApproveResult, x))
    );
  }

  private deactivate_currently_approved_pages(pages: Page<string | {}>[], model: Page<string | {}>) {
    pages.forEach(page => {
      page.effectiveTo = new Date(model.effectiveFrom);
      page.effectiveTo.setMilliseconds(model.effectiveFrom.getMilliseconds() - 1);
    });
  }
}

export class PageApproveResult {
  status = '';
  savedBy = '';
  @Reflect.metadata('design:type', Date)
  savedOn: Date = null;
  version = 0;
}
