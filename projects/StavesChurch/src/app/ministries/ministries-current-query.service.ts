import { Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { PageCurrentQuery } from 'material-cms';
import { map } from 'rxjs/operators';
import { Ministries } from './ministries';

@Injectable({ providedIn: 'root' })
export class MinistriesCurrentQuery {
  constructor(
    private pageCurrentQuery: PageCurrentQuery,
  ) { }

  execute() {
    return this.pageCurrentQuery.execute('ministries').pipe(
      map(page => DomainHelper.adapt(Ministries, page.content))
    );
  }
}
