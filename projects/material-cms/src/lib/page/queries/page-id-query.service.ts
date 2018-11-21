import { Inject, Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { map } from 'rxjs/operators';
import { Page } from '../../page';
import { PageDatabase, PAGE_DATABASE } from '../../page-database';

@Injectable({ providedIn: 'root' })
export class PageIdQuery {
  constructor(
    @Inject(PAGE_DATABASE) private pageDatabase: PageDatabase
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
