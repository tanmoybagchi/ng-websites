import { Page } from 'material-cms';
import { SermonContent } from '@app/sermon/sermon';

export class AdminSermon extends Page<SermonContent> {
  kind = 'sermon';
  content = new SermonContent();
}
