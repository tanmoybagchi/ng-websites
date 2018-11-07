import { ValueObject } from 'core';

export class Ministry extends ValueObject {
  name = '';
  purpose = '';
}

export class Ministries extends ValueObject {
  header = '';
  @Reflect.metadata('design:type', Ministry)
  list: Ministry[] = [];
}
