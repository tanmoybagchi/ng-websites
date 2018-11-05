import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventManagerService, LocalStorageService } from 'core';
import { SheetReadQuery } from 'gapi';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  templateUrl: './sheet.component.html'
})
export class SheetComponent implements OnInit {
  errors: any;
  model: any;

  constructor(
    private eventManagerService: EventManagerService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private sheetReadQuery: SheetReadQuery,
  ) { }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.sheetReadQuery.execute(this.localStorageService.get('spreadsheetId'), '', 'sheets/properties(title)').pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(model => this.onSheetQuery(model));
  }

  onSelect(item) {
    this.localStorageService.set('sheetId', item.properties.title);
    this.router.navigate(['/recipes']);
  }

  private onSheetQuery(model) {
    this.model = model;
  }

  private onError(errors) {
    this.errors = errors;
    return EMPTY;
  }
}
