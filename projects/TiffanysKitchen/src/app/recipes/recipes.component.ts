import { Component, OnInit } from '@angular/core';
import { MatChipEvent } from '@angular/material';
import { Router } from '@angular/router';
import { EventManagerService, Result } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Ingredient, Recipe } from '../recipes/models';
import { SyncDatabaseCommand } from '../recipes/sync-database-command.service';
import { DomainHelper } from 'projects/core/src/public_api';

@Component({
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  errors: any;
  ingredients: Ingredient[];
  recipes: RecipeVM[];
  search: string;
  searchTerms: string[];
  searched: boolean;

  constructor(
    private eventManagerService: EventManagerService,
    private router: Router,
    private syncDatabaseCommand: SyncDatabaseCommand,
  ) {
    this.ingredients = [];
    this.recipes = [];
    this.searchTerms = [];
    this.searched = false;
  }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.syncDatabaseCommand.execute().pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe((value: Ingredient) => this.onSyncDatabase(value));
  }

  private onSyncDatabase(value: Ingredient) {
    this.ingredients.push(value);
  }

  addSearchTerm() {
    if (String.isNullOrWhitespace(this.search)) {
      return;
    }

    this.search.split('+').forEach(x => {
      x = x.replace(',', '');
      if (String.hasData(x) && this.searchTerms.indexOf(x) === -1) {
        this.searchTerms.push(x);
      }
    });

    this.search = '';

    this.searchRecipes();
  }

  removeSearchTerm($event: MatChipEvent) {
    const index = this.searchTerms.indexOf($event.chip.value);

    if (index === -1) { return; }

    this.searchTerms.splice(index, 1);

    if (!this.searched) { return; }

    if (this.searchTerms.length === 0) {
      this.recipes = [];
      this.searched = false;
      return;
    }

    this.searchRecipes();
  }

  searchRecipes() {
    this.recipes = [];
    this.searched = true;

    this.searchTerms.forEach(st => {
      const lowerCaseSearchTerm = st.toLowerCase();

      const matchedIngredients = this.ingredients.filter(i => i.name.indexOf(lowerCaseSearchTerm) > -1);
      if (matchedIngredients.length === 0) { return; }

      matchedIngredients.forEach(ingredient => {
        ingredient.recipes.forEach(ingredientRecipe => {
          let recipeVM = this.recipes.find(r => r.page === ingredientRecipe.page);

          if (!recipeVM) {
            recipeVM = DomainHelper.adapt(RecipeVM, ingredientRecipe);
            this.recipes.push(recipeVM);
          }

          recipeVM.ingredients.push(ingredient.name);
        });
      });
    });

    this.recipes
      .forEach(rvm => {
        rvm.missingIngredients = this.searchTerms
          .map(st => st.toLowerCase())
          .filter(st => rvm.ingredients.every(i => i.indexOf(st) === -1));
      });

    this.recipes
      .sort((a, b) => {
        const missingIngredientsCompare = a.missingIngredients.length - b.missingIngredients.length;
        if (missingIngredientsCompare !== 0) { return missingIngredientsCompare; }

        const nameA = a.page.toUpperCase(); // ignore upper and lowercase
        const nameB = b.page.toUpperCase(); // ignore upper and lowercase

        if (nameA < nameB) {
          return -1;
        }

        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
  }

  private onError(result: Result) {
    if (result.errors.general && result.errors.general.databaseNotFound) {
      this.router.navigate(['/setup']);
    } else {
      this.errors = result.errors;
    }

    return EMPTY;
  }
}

export class RecipeVM extends Recipe {
  ingredients: string[] = [];
  missingIngredients: string[];
}
