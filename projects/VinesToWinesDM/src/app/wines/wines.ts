import { ValueObject } from 'core';

export class Wine extends ValueObject {
  description = '';
  name = '';
  photoId = 0;
}

export class WineType extends ValueObject {
  name = '';
  description = '';
  @Reflect.metadata('design:type', Wine)
  wines: Wine[] = [];
}

export class Wines extends ValueObject {
  summary = '';
  @Reflect.metadata('design:type', WineType)
  wineTypes: WineType[] = [];
}
