import { Injectable } from '@angular/core';
import { PagesCurrentQuery } from '@app/page/pages-current-query.service';
import { DomainHelper } from 'core';
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
