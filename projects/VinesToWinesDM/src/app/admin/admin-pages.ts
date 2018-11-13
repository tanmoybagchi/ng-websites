import { Pages } from '../page/pages';

export class AdminPages extends Pages {
  readonly adminList = this.list
    .sort((a, b) => a.name.localeCompare(b.name));
}
