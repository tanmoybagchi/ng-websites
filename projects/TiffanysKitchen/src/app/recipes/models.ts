export class Ingredient {
  name = '';
  recipes: Recipe[];

  constructor() {
    this.recipes = [];
  }
}

export class Recipe {
  page = '';
  quantity = '';
  slowCookerSize = '';
  rating = '';
}
