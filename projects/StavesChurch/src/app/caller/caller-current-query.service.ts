import { Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { PagesCurrentQuery } from 'material-cms-view';
import { map } from 'rxjs/operators';
import { Caller } from './caller';

@Injectable({ providedIn: 'root' })
export class CallerCurrentQuery {
  constructor(
    private pagesCurrentQuery: PagesCurrentQuery,
  ) { }

  execute() {
    return this.pagesCurrentQuery.execute('caller').pipe(
      map(list => list.map(item => DomainHelper.adapt(Caller, item)))
    );
  }
}
