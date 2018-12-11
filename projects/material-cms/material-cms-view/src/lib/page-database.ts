import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from './page';

export interface PageDatabase {
  getCurrentPage(kind: string): Observable<PageDatabase.GetCurrentPageResult>;
  getCurrentPages(kind: string): Observable<PageDatabase.GetCurrentPagesResult[]>;
  list(kind: string): Observable<PageDatabase.ListResult[]>;
  listWithContent(kind: string): Observable<PageDatabase.ListWithContentResult[]>;
  get(id: number): Observable<Page>;
  add(pageToAdd: Page): Observable<PageDatabase.AddUpdateResult>;
  addAll(pagesToAdd: Page[]): Observable<PageDatabase.AddUpdateResult[]>;
  update(updatedPage: Page): Observable<PageDatabase.AddUpdateResult>;
  updateAll(updatedPages: Page[]): Observable<PageDatabase.AddUpdateResult[]>;
  remove(page: Page): Observable<never>;
}

export const PAGE_DATABASE = new InjectionToken<PageDatabase>('PageDatabase');

export namespace PageDatabase {
  export class GetCurrentPageResult {
    content = '';
  }

  export class GetCurrentPagesResult {
    identifier = '';
    @Reflect.metadata('design:type', Date)
    effectiveFrom: Date = null;
    @Reflect.metadata('design:type', Date)
    effectiveTo: Date = null;
    content = '';
  }

  export class ListResult {
    id = 0;
    @Reflect.metadata('design:type', Date)
    effectiveFrom: Date = null;
    @Reflect.metadata('design:type', Date)
    effectiveTo: Date = null;
    status = '';
  }

  export class ListWithContentResult extends ListResult {
    content = '';
  }

  export class AddUpdateResult {
    id = 0;
    savedBy = '';
    @Reflect.metadata('design:type', Date)
    savedOn: Date = null;
    version = 0;
  }
}
