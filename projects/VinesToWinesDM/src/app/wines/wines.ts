import { ValueObject } from 'core';

export class Wine extends ValueObject {
  aging = '';
  description = '';
  foodPairings = '';
  name = '';
  oak = '';
  photoIdentifier = '';
  sweetness = '';
}

export class Wines extends ValueObject {
  header = '';
  @Reflect.metadata('design:type', Wine)
  reds: Wine[] = [];
  whites: Wine[] = [];
  speciality: Wine[] = [];
}
