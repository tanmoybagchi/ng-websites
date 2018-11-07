import { Component, OnInit } from '@angular/core';
import { Result } from 'core';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Caller } from './caller';
import { CallerCurrentQuery } from './caller-current-query.service';

@Component({
  templateUrl: './caller.component.html',
  styleUrls: ['./caller.component.scss']
})
export class CallerComponent implements OnInit {
  errors: any;
  model: Caller[];

  constructor(
    private callerCurrentQuery: CallerCurrentQuery
  ) { }

  ngOnInit() {
    this.callerCurrentQuery.execute().pipe(
      catchError(err => this.onError(err))
    ).subscribe(_ => this.onCaller(_));
  }

  private onCaller(value: Caller[]) {
    this.model = value;
  }

  onOKClick() {
    window.history.back();
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
