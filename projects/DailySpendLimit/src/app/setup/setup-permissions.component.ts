import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventManagerService, Result } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  templateUrl: './setup-permissions.component.html'
})
export class SetupPermissionsComponent implements OnInit {
  errors: any;
  model = '';

  constructor(
    private eventManagerService: EventManagerService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  onSubmit() {
  }

  private onError(result: Result) {
    this.errors = result.errors;

    return EMPTY;
  }
}
