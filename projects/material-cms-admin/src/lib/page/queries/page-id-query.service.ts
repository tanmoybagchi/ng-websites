import { Inject, Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { Page } from 'material-cms-view';
import { map } from 'rxjs/operators';
import { AdminPageDatabase, ADMIN_PAGE_DATABASE } from '../../admin-page-database';

@Injectable({ providedIn: 'root' })
export class PageIdQuery {
  constructor(
    @Inject(ADMIN_PAGE_DATABASE) private pageDatabase: AdminPageDatabase
  ) { }

  execute<TPage extends Page>(id: number, kind: string, modelCreator: { new(): TPage }) {
    return this.pageDatabase.get(kind).pipe(
      map(list => {
        const res = list.filter(x => x.id === id);
        return res.length === 0 ? null : DomainHelper.adapt(modelCreator, res[0]);
      })
    );
  }
}
