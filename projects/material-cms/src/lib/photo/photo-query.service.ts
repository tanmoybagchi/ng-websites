import { Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { map } from 'rxjs/operators';
import { PagesCurrentQuery } from '../page/queries/pages-current-query.service';
import { Photo } from './photo';

@Injectable({ providedIn: 'root' })
export class PhotoQuery {
  constructor(
    private pagesCurrentQuery: PagesCurrentQuery
  ) { }

  execute() {
    return this.pagesCurrentQuery.execute('photo').pipe(
      map(pages => pages.map(item => {
        const photo = DomainHelper.adapt(Photo, item);
        photo.setSizes(JSON.parse(<string>item.content));
        return photo;
      }))
    );
  }
}
