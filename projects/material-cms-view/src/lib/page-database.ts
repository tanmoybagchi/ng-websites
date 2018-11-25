import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from './page';

export interface PageDatabase {
  get(kind: string): Observable<Page[]>;
}

export const PAGE_DATABASE = new InjectionToken<PageDatabase>('PageDatabase');
