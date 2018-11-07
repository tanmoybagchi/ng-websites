import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Page } from './page';
import { PageDatabase } from './page-database';
import { PageModule } from './page.module';

@Injectable({
  providedIn: PageModule
})
export class PagesCurrentQuery {
  constructor(
    private pageService: PageDatabase,
  ) { }

  execute(kind: string) {
    return this.pageService.get(kind).pipe(
      map(pages => this.getCurrentPagesInternal(pages))
    );
  }

  private getCurrentPagesInternal(pages: Page[]) {
    const result = this.currentPages(pages);
    return result.length === 0 ? [] : result;
  }

  private currentPages(pages: Page[]) {
    const now = Date.now();
    return pages.filter(x => x.status === 'Approved' && x.effectiveFrom.valueOf() <= now && x.effectiveTo.valueOf() > now);
  }
}
