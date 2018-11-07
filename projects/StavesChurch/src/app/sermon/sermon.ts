import { ValueObject } from 'core';

export class Sermon {
  content = new SermonContent();
  @Reflect.metadata('design:type', Date)
  effectiveFrom: Date = null;
}

export class SermonContent extends ValueObject {
  title = '';
  location = '';
}
