import { Inject, Injectable } from '@angular/core';
import { Page } from 'material-cms-view';
import { Observable } from 'rxjs';
import { AdminPageDatabase, ADMIN_PAGE_DATABASE } from '../../admin-page-database';

@Injectable({ providedIn: 'root' })
export class PageListQuery {
  constructor(
    @Inject(ADMIN_PAGE_DATABASE) private pageDatabase: AdminPageDatabase
  ) { }

  execute(kind: string): Observable<Page[]> {
    return this.pageDatabase.get(kind);
  }
}
