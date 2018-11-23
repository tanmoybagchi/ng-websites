import { AnnouncementContent } from '@app/announcement/announcement';
import { Page } from 'material-cms';

export class AdminAnnouncement extends Page<AnnouncementContent> {
  kind = 'announcement';
  content = new AnnouncementContent();
}
