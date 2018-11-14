import { Component, OnInit } from '@angular/core';
import { Result } from 'core';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EventList } from '../events-models';
import { EventsQuery } from '../events-query.service';

@Component({
  selector: 'vtw-events-summary',
  templateUrl: './events-summary.component.html',
  styleUrls: ['./events-summary.component.scss']
})
export class EventsSummaryComponent implements OnInit {
  errors: any;
  model: EventList;

  constructor(
    private eventsQuery: EventsQuery
  ) { }

  ngOnInit() {
    this.eventsQuery.execute().pipe(
      catchError(err => this.onError(err))
    ).subscribe((value: EventList) => this.onEventsQuery(value));
  }

  onEventsQuery(value: EventList) {
    this.model = value;
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
