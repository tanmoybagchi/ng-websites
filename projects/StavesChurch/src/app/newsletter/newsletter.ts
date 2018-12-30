import { ValueObject } from 'core';

export class Newsletter {
  @Reflect.metadata('design:type', Date)
  effectiveFrom: Date = null;
  content = new NewsletterContent();
}

export class NewsletterContent extends ValueObject {
  title = '';
  location = '';
}
