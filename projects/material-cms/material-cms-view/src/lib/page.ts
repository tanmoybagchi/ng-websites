import { Entity } from 'core';

export class Page<T = {} | string> extends Entity {
  kind = '';
  @Reflect.metadata('design:type', Date)
  effectiveFrom: Date = null;
  @Reflect.metadata('design:type', Date)
  effectiveTo: Date = null;
  content: T = '' as any;
}
