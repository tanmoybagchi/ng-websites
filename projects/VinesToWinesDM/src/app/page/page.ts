import { Entity } from 'core';

export class Page extends Entity {
  kind = '';
  identifier = '';
  @Reflect.metadata('design:type', Date)
  effectiveFrom: Date = null;
  @Reflect.metadata('design:type', Date)
  effectiveTo: Date = null;
  content = '';
}
