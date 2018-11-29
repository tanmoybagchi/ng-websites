import { ValueObject } from 'core';

export class Wine extends ValueObject {
  description = '';
  name = '';
  photoIdentifier = '';
}

export class WineType extends ValueObject {
  name = '';
  description = '';
  @Reflect.metadata('design:type', Wine)
  wines: Wine[] = [];
}

export class Wines extends ValueObject {
  @Reflect.metadata('design:type', WineType)
  wineTypes: WineType[] = [];
}
