import { Injectable } from '@angular/core';
import { AdminModule } from '@app/admin/admin.module';
import { DomainHelper } from 'core';
import { map } from 'rxjs/operators';
import { AdminPageDatabase } from '../../admin-page-database';
import { Page } from '../page';

@Injectable({ providedIn: AdminModule })
export class PageCreateCommand {
  constructor(
    private pageDatabase: AdminPageDatabase
  ) { }

  execute(kind: string) {
    const model = new Page();
    model.kind = kind;

    return this.pageDatabase.add(model).pipe(
      map(x => DomainHelper.adapt(PageCreateResult, x))
    );
  }
}

export class PageCreateResult {
  id = 0;
  identifier = '';
  status = '';
  savedBy = '';
  @Reflect.metadata('design:type', Date)
  savedOn: Date = null;
  version = 0;
}
