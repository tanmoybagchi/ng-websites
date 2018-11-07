import { Page } from '@app/admin/page/page';
import { Homepage } from '@app/homepage/homepage';

export class AdminHomepage extends Page<Homepage> {
  kind = 'homepage';
  content = new Homepage();
}
