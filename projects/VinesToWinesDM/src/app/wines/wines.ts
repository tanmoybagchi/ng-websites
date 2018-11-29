import { ValueObject } from 'core';

export class Wine extends ValueObject {
  description = '';
  name = '';
  photoIdentifier = '';
}

export class Wines extends ValueObject {
  @Reflect.metadata('design:type', Wine)
  reds: Wine[] = [];
  @Reflect.metadata('design:type', Wine)
  whites: Wine[] = [];
  @Reflect.metadata('design:type', Wine)
  speciality: Wine[] = [];
}
