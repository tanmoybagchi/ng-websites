import { Page } from 'material-cms-view';
import { SermonContent } from '@app/sermon/sermon';

export class AdminSermon extends Page<SermonContent> {
  kind = 'sermon';
  content = new SermonContent();
}
