import { SitePages } from 'material-cms-view';

export class MySitePages implements SitePages {
  // This order is important.
  readonly list: { link: string, name: string, xs?: boolean, sm?: boolean, md?: boolean, lg?: boolean }[] = [
    { link: '3-ways-to-attend', name: '3 Ways to Attend', xs: true },
    { link: '2-step-process', name: '2 Step Process', xs: true },
    { link: 'events', name: 'Events', xs: true },
    { link: 'wine-list', name: 'Wine List', md: true },
    { link: 'testimonials', name: 'Testimonials', md: true },
  ];
}
