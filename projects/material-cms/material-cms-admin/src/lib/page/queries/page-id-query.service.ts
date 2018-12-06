import { Inject, Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { Page, PageDatabase, PAGE_DATABASE } from 'material-cms-view';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PageIdQuery {
  constructor(
    @Inject(PAGE_DATABASE) private pageDatabase: PageDatabase
  ) { }

  execute<TPage extends Page>(id: number, modelCreator: { new(): TPage }) {
    return this.pageDatabase.get(id).pipe(
      map(page => DomainHelper.adapt(modelCreator, page))
    );
  }
}
