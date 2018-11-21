import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from './page';

export interface PageDatabase {
  get(kind: string): Observable<Page[]>;
  add(pageToAdd: Page): Observable<Page>;
  addAll(pagesToAdd: Page[]): Observable<Page[]>;
  update(updatedPage: Page): Observable<Page>;
  updateAll(updatedPages: Page[]): Observable<Page[]>;
  remove(page: Page): Observable<never>;
}

export const PAGE_DATABASE = new InjectionToken<PageDatabase>('PageDatabase');
