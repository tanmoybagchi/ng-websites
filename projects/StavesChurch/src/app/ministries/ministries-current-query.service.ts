import { Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { Ministries, Ministry } from '@app/ministries/ministries';
import { MinistriesModule } from '@app/ministries/ministries.module';
import { PageCurrentQuery } from '@app/page/page-current-query.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: MinistriesModule })
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
