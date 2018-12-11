import { Inject, Injectable } from '@angular/core';
import { Page, PAGE_DATABASE, PageDatabase } from 'material-cms-view';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PageListQuery {
  constructor(
    @Inject(PAGE_DATABASE) private pageDatabase: PageDatabase
  ) { }

  execute(kind: string) {
    return this.pageDatabase.list(kind);
  }
}
