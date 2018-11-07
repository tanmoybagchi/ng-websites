import { ValueObject } from 'core';

export class Caller {
  @Reflect.metadata('design:type', Date)
  effectiveFrom: Date = null;
  content = new CallerContent();
}

export class CallerContent extends ValueObject {
  title = '';
  location = '';
}
