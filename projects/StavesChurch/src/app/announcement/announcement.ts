import { ValueObject } from 'core';

export class Announcement {
  identifier = '';
  @Reflect.metadata('design:type', Date)
  effectiveTo: Date = null;
  content = new AnnouncementContent();
}

export class AnnouncementContent extends ValueObject {
  title = '';
  description = '';
  urgent = false;
}
