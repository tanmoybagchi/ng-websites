import { Injectable } from '@angular/core';
import { AdminPageDatabase } from '@app/admin/admin-page-database';
import { AdminModule } from '../../admin.module';

@Injectable({ providedIn: AdminModule })
export class PageListQuery {
  constructor(
    private pageDatabase: AdminPageDatabase
  ) { }

  execute(kind: string) {
    return this.pageDatabase.get(kind);
  }
}
