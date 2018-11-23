import { CallerContent } from '@app/caller/caller';
import { Page } from 'material-cms';

export class AdminCaller extends Page<CallerContent> {
  kind = 'caller';
  content = new CallerContent();
}
