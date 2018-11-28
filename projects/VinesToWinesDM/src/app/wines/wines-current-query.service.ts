import { Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { PageCurrentQuery } from 'material-cms-view';
import { map } from 'rxjs/operators';
import { Wines } from './wines';

@Injectable({ providedIn: 'root' })
export class WinesCurrentQuery {
  constructor(
    private pageCurrentQuery: PageCurrentQuery,
  ) { }

  execute() {
    return this.pageCurrentQuery.execute('Wines').pipe(
      map(page => DomainHelper.adapt(Wines, page.content))
    );
  }
}
