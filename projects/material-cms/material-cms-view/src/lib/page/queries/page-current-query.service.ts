import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Page } from '../../page';
import { PageDatabase, PAGE_DATABASE } from '../../page-database';

@Injectable({ providedIn: 'root' })
export class PageCurrentQuery {
  constructor(
    @Inject(PAGE_DATABASE) private pageDatabase: PageDatabase
  ) { }

  execute(kind: string) {
    return this.pageDatabase.getCurrentPage(kind);
  }
}
