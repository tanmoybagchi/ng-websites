import { Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { PagesCurrentQuery } from 'material-cms-view';
import { map } from 'rxjs/operators';
import { Sermon } from './sermon';
import { SermonModule } from './sermon.module';

@Injectable({ providedIn: SermonModule })
export class SermonCurrentQuery {
  constructor(
    private pagesCurrentQuery: PagesCurrentQuery
  ) { }

  execute() {
    return this.pagesCurrentQuery.execute('sermon').pipe(
      map(list => list.map(item => DomainHelper.adapt(Sermon, item)))
    );
  }
}
