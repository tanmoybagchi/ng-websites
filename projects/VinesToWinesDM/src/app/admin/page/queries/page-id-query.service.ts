import { Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { map } from 'rxjs/operators';
import { AdminPageDatabase } from '@app/admin/admin-page-database';
import { AdminModule } from '../../admin.module';
import { Page } from '../page';

@Injectable({ providedIn: AdminModule })
export class PageIdQuery {
  constructor(
    private pageDatabase: AdminPageDatabase
  ) { }

  execute<TPage extends Page>(id: number, kind: string, modelCreator: { new(): TPage }) {
    return this.pageDatabase.get(kind).pipe(
      map(list => {
        const res = list.filter(x => x.id === id);
        return res.length === 0 ? null : DomainHelper.adapt(modelCreator, res[0]);
      })
    );
  }
}
