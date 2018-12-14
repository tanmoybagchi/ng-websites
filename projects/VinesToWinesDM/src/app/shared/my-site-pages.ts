import { SitePages } from 'material-cms-view';

export class MySitePages implements SitePages {
  // This order is important.
  readonly list: { link: string, name: string, width?: number}[] = [
    { link: '3-ways-to-attend', name: '3 Ways to Attend', width: 123 },
    { link: '2-step-process', name: '2 Step Process', width: 110 },
    { link: 'photos', name: 'Photos' },
    { link: 'events', name: 'Events', width: 57 },
    { link: 'wines', name: 'Wine List', width: 73 },
    // { link: 'testimonials', name: 'Testimonials', md: true },
  ];
}
