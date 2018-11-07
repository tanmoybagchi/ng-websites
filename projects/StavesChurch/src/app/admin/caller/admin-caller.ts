import { Page } from '@app/admin/page/page';
import { CallerContent } from '@app/caller/caller';

export class AdminCaller extends Page<CallerContent> {
  kind = 'caller';
  content = new CallerContent();
}
