import { Page } from '@app/admin/page/page';
import { SermonContent } from '@app/sermon/sermon';

export class AdminSermon extends Page<SermonContent> {
  kind = 'sermon';
  content = new SermonContent();
}
