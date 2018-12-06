import { Inject, Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { map } from 'rxjs/operators';
import { PageDatabase, PAGE_DATABASE } from '../page-database';
import { Photo } from './photo';

@Injectable({ providedIn: 'root' })
export class PhotoQuery {
  constructor(
    @Inject(PAGE_DATABASE) private pageDatabase: PageDatabase
  ) { }

  execute() {
    return this.pageDatabase.getCurrentPages('photo').pipe(
      map(pages => pages.map(item => {
        const photo = DomainHelper.adapt(Photo, item);
        photo.setSizes(JSON.parse(<string>item.content));
        return photo;
      }))
    );
  }
}
