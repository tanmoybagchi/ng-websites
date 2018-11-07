import { Page } from '@app/admin/page/page';
import { AnnouncementContent } from '@app/announcement/announcement';

export class AdminAnnouncement extends Page<AnnouncementContent> {
  kind = 'announcement';
  content = new AnnouncementContent();
}
