import { Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { PagesCurrentQuery } from 'material-cms-view';
import { map } from 'rxjs/operators';
import { Announcement } from './announcement';

@Injectable({ providedIn: 'root' })
export class AnnouncementCurrentQuery {
  constructor(
    private pagesCurrentQuery: PagesCurrentQuery,
  ) { }

  execute() {
    return this.pagesCurrentQuery.execute('announcement').pipe(
      map(list => list.map(item => DomainHelper.adapt(Announcement, item)))
    );
  }
}
