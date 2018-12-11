import { Inject, Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { map } from 'rxjs/operators';
import { PageDatabase, PAGE_DATABASE } from '../page-database';
import { Photo } from './photo';

@Injectable({ providedIn: 'root' })
export class PhotoGetQuery {
  constructor(
    @Inject(PAGE_DATABASE) private pageDatabase: PageDatabase
  ) { }

  execute(id: number) {
    return this.pageDatabase.get(id).pipe(
      map(item => {
        const photo = DomainHelper.adapt(Photo, item);
        photo.setSizes(JSON.parse(<string>item.content));
        return photo;
      })
    );
  }
}
