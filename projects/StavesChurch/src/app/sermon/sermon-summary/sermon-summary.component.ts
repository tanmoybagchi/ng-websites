import { Component, OnInit } from '@angular/core';
import { Result } from 'core';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Sermon } from '../sermon';
import { SermonCurrentQuery } from '../sermon-current-query.service';

@Component({
  selector: 'app-sermon-summary',
  templateUrl: './sermon-summary.component.html'
})
export class SermonSummaryComponent implements OnInit {
  errors: any;
  model: Sermon[];

  constructor(
    private sermonCurrentQuery: SermonCurrentQuery
  ) { }

  ngOnInit() {
    this.sermonCurrentQuery.execute().pipe(
      catchError(err => this.onError(err))
    ).subscribe(_ => this.onSermon(_));
  }

  private onSermon(value: Sermon[]) {
    this.model = value.slice(0, 3);
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
