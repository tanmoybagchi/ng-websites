import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'material-cms-view';

export interface AdminPageDatabase {
  get(kind: string): Observable<Page[]>;
  add(pageToAdd: Page): Observable<Page>;
  addAll(pagesToAdd: Page[]): Observable<Page[]>;
  update(updatedPage: Page): Observable<Page>;
  updateAll(updatedPages: Page[]): Observable<Page[]>;
  remove(page: Page): Observable<never>;
}

export const ADMIN_PAGE_DATABASE = new InjectionToken<AdminPageDatabase>('AdminPageDatabase');
