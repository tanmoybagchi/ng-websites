import { Injectable } from '@angular/core';
import { AnnouncementModule } from '@app/announcement/announcement.module';
import { PagesCurrentQuery } from '@app/page/pages-current-query.service';
import { DomainHelper } from 'core';
import { map } from 'rxjs/operators';
import { Announcement } from './announcement';

@Injectable({ providedIn: AnnouncementModule })
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
