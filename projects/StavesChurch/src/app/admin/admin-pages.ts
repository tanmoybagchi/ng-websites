import { Pages } from '../page/pages';

export class AdminPages extends Pages {
  readonly adminList = this.list
    .concat([
      { link: 'announcement', name: 'Announcements' }
    ])
    .sort((a, b) => a.name.localeCompare(b.name));
}
