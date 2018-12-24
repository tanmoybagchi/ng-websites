import { Component, OnInit } from '@angular/core';
import { EventManagerService, Result } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { EventList } from '../events-models';
import { EventsQuery } from '../events-query.service';

@Component({
  templateUrl: './events-detail.component.html',
  styleUrls: ['./events-detail.component.scss']
})
export class EventsDetailComponent implements OnInit {
  errors: any;
  model: EventList;
  private endOfNextYear: Date;

  constructor(
    private eventManagerService: EventManagerService,
    private eventsQuery: EventsQuery,
  ) {
    this.endOfNextYear = new Date();
    this.endOfNextYear.setFullYear(this.endOfNextYear.getFullYear() + 1, 11, 31);
    this.endOfNextYear.setHours(23, 59, 59);
  }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.eventsQuery.execute(this.endOfNextYear).pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe((value: EventList) => this.onEventsQuery(value));
  }

  private onEventsQuery(value: EventList) {
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
