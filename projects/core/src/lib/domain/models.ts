export class ValueObject { }

export class Entity {
  id = 0;
  status = 'Draft';
  savedBy = '';
  @Reflect.metadata('design:type', Date)
  savedOn: Date = null;
  version = 0;
}
