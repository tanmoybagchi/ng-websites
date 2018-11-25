import { AnnouncementContent } from '@app/announcement/announcement';
import { Page } from 'material-cms-view';

export class AdminAnnouncement extends Page<AnnouncementContent> {
  kind = 'announcement';
  content = new AnnouncementContent();
}
