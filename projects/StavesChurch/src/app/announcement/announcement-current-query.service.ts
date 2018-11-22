import { Injectable } from '@angular/core';
import { AnnouncementModule } from '@app/announcement/announcement.module';
import { DomainHelper } from 'core';
import { map } from 'rxjs/operators';
import { Announcement } from './announcement';
import { PagesCurrentQuery } from 'material-cms';

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
