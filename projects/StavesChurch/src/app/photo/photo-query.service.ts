import { Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { PageDatabase } from '@app/page/page-database';
import { Photo } from '@app/photo/photo';
import { PhotoModule } from '@app/photo/photo.module';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: PhotoModule
})
export class PhotoQuery {
  constructor(
    private pageDatabase: PageDatabase
  ) {  }

  execute() {
    return this.pageDatabase.get('photo').pipe(
      map(pages => pages
        .filter(item => item.status === 'Approved')
        .map(item => {
          const photo = new Photo();
          DomainHelper.adapt(photo, item);
          photo.setSizes(JSON.parse(item.content));
          return photo;
        })
      )
    );
  }
}
