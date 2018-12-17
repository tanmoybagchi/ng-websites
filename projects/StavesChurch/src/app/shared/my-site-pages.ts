import { SitePages } from 'material-cms-view';

export class MySitePages implements SitePages {
  // This order is important.
  readonly list: { link: string, name: string, width?: number }[] = [
    { link: 'announcement', name: 'Announcements' },
    { link: 'events', name: 'Events', width: 58 },
    { link: 'services', name: 'Services', width: 70 },
    { link: 'ministries', name: 'Ministries', width: 79 },
    { link: 'transportation', name: 'Transportation', width: 109 },
    { link: 'pastor', name: 'Pastor', width: 57 },
    { link: 'sermon', name: 'Sermon', width: 65 },
    { link: 'photos', name: 'Photos', width: 60 },
    { link: 'united-methodist-women', name: 'United Methodist Women', width: 175 },
    { link: 'vision', name: 'Vision', width: 55 },
    { link: 'newsletter', name: 'Newsletter', width: 84 },
    { link: 'staff', name: 'Staff', width: 47 },
    { link: 'history', name: 'History', width: 61 },
  ];
}
