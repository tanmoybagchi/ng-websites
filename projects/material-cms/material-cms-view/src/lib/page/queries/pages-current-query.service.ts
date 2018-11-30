import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Page } from '../../page';
import { PageDatabase, PAGE_DATABASE } from '../../page-database';

@Injectable({ providedIn: 'root' })
export class PagesCurrentQuery {
  constructor(
    @Inject(PAGE_DATABASE) private pageDatabase: PageDatabase
  ) { }

  execute(kind: string) {
    return this.pageDatabase.get(kind).pipe(
      map(pages => this.getCurrentPagesInternal(pages))
    );
  }

  private getCurrentPagesInternal(pages: Page[]) {
    const now = Date.now();

    const approvedPages = pages.filter(x => x.status === 'Approved' && x.effectiveFrom.valueOf() <= now);
    if (approvedPages.length === 0) {
      return [];
    }

    let result: Page[];

    if (approvedPages[0].effectiveTo) {
      result = approvedPages.filter(x => x.effectiveTo.valueOf() > now);
    } else {
      const mostRecentlyApproved = Math.max(...approvedPages.map(x => x.effectiveFrom.valueOf()));

      result = approvedPages.filter(x => x.effectiveFrom.valueOf() === mostRecentlyApproved);
    }

    return result;
  }
}
