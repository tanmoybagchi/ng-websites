import { InjectionToken } from '@angular/core';

export interface SitePages {
  list: { link: string, name: string; }[];
}

export const SITE_PAGES = new InjectionToken<SitePages>('InternalLinks');
