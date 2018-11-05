import { Injectable } from '@angular/core';
import { IndexedDBConfig, IndexedDBHelper, LocalStorageService, Result } from 'core';
import { DriveFilePropertiesQuery, GoogleSpreadsheet, SheetReadQuery } from 'gapi';
import { EMPTY, from, Observable, of, throwError, zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DatabaseConfig } from './database-config';
import { Ingredient, Recipe } from './models';

@Injectable({ providedIn: 'root' })
export class SyncDatabaseCommand {
  private readonly dbConfig: IndexedDBConfig;
  private sheetName: string;
  private spreadsheetId: string;

  constructor(
    private driveFilePropertiesQuery: DriveFilePropertiesQuery,
    private idbHelper: IndexedDBHelper,
    private localStorageService: LocalStorageService,
    private sheetReadQuery: SheetReadQuery,
  ) {
    this.dbConfig = new DatabaseConfig();
  }

  execute() {
    this.spreadsheetId = this.localStorageService.get('spreadsheetId');
    this.sheetName = this.localStorageService.get('sheetId');
    const result = new Result();

    if (String.isNullOrWhitespace(this.spreadsheetId) || String.isNullOrWhitespace(this.sheetName)) {
      result.addError('DatabaseNotFound');
      return throwError(result);
    }

    return this.idbHelper.open(this.dbConfig).pipe(
      switchMap(db => this.onDBOpen(db))
    );
  }

  private onDBOpen(db: IDBDatabase) {
    return this.driveFilePropertiesQuery.execute(this.spreadsheetId).pipe(
      switchMap(value => this.onDriveFile(db, value))
    );
  }

  private onDriveFile(db: IDBDatabase, value: any) {
    if (value.modifiedTime === this.localStorageService.get('modifiedTime')) {
      return this.readDatabase(db);
    }

    this.localStorageService.set('modifiedTime', value.modifiedTime);

    return this.populateDatabase(db);
  }

  private readDatabase(db: IDBDatabase) {
    return this.idbHelper.openCursor(db, this.dbConfig.tables[0].name).pipe(
      switchMap(cursor => this.onopenCursor(db, cursor))
    );
  }

  private onopenCursor(db: IDBDatabase, cursor: IDBCursorWithValue) {
    if (cursor) {
      cursor.continue();
      return of(<Ingredient>cursor.value);
    } else {
      return EMPTY;
    }
  }

  private populateDatabase(db: IDBDatabase) {
    return this.idbHelper.clear(db, this.dbConfig.tables[0].name).pipe(
      switchMap(_ => this.onDBClear(db))
    );
  }

  private onDBClear(db: IDBDatabase) {
    return this.sheetReadQuery.execute(this.spreadsheetId, this.sheetName, 'sheets(data(rowData(values/formattedValue)))').pipe(
      switchMap(_ => this.onSheetQuery(db, _))
    );
  }

  private onSheetQuery(db: IDBDatabase, value: GoogleSpreadsheet) {
    const addObservables: Observable<{}>[] = [];
    const ingredients: Ingredient[] = [];

    value.sheets[0].data[0].rowData.forEach(row => {
      if (!row.values) { return; }

      const ingredientName = row.values[0].formattedValue.trim().toLowerCase().replace('  ', ' ');
      let ingredient: Ingredient;

      const existingIngredient = ingredients.filter(x => x.name === ingredientName);
      if (existingIngredient.length === 1) {
        ingredient = existingIngredient[0];
      } else {
        ingredient = new Ingredient();
        ingredients.push(ingredient);

        ingredient.name = ingredientName;
      }

      const recipe = new Recipe();
      const page = row.values[1].formattedValue;
      if (page.length > 1) {
        const book = page[0];
        const pageNumber = Number(page.slice(1));
        if (pageNumber !== NaN) {
          recipe.page = `${book}${pageNumber.toString().padStart(3, '0')}`;
        }
      } else {
        recipe.page = row.values[1].formattedValue;
      }

      if (ingredient.recipes.some(x => x.page === recipe.page)) { return; }

      recipe.quantity = row.values[2] ? row.values[2].formattedValue : '';
      recipe.slowCookerSize = row.values[3] ? row.values[3].formattedValue : '';
      recipe.rating = row.values[4] ? row.values[4].formattedValue : '';

      ingredient.recipes.push(recipe);
    });

    ingredients.forEach(x => {
      addObservables.push(this.idbHelper.add(db, this.dbConfig.tables[0].name, x));
    });

    return zip(...addObservables).pipe(
      switchMap(_ => from(ingredients))
    );
  }
}
