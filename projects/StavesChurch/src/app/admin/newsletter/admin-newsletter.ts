import { NewsletterContent } from '@app/newsletter/newsletter';
import { Page } from 'material-cms-view';

export class AdminNewsletter extends Page<NewsletterContent> {
  kind = 'caller';
  content = new NewsletterContent();
}
