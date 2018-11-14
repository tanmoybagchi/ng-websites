import { Component, OnInit } from '@angular/core';
import { Result } from 'core';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EventList } from '../events-models';
import { EventsQuery } from '../events-query.service';

@Component({
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  errors: any;
  model: EventList;
  itemIndex = 0;

  constructor(
    private eventsQuery: EventsQuery
  ) { }

  ngOnInit() {
    this.eventsQuery
      .execute('10')
      .pipe(catchError(err => this.onError(err)))
      .subscribe((value: EventList) => this.onEventsQuery(value));
  }

  private onEventsQuery(value: EventList) {
    this.model = value;
  }

  onTodayClick() {
    this.itemIndex = 0;
  }

  onLeftClick() {
    if (this.itemIndex > 0) {
      this.itemIndex -= 10;
    }
  }

  onRightClick() {
    if (this.itemIndex === this.model.items.length - 10) {
      this.eventsQuery
        .execute('10', this.model.items[this.model.items.length - 1].start)
        .pipe(catchError(err => this.onError(err)))
        .subscribe((value: EventList) => {
          Array.prototype.push.apply(this.model.items, value.items);
          this.itemIndex += 10;
        });
    } else {
      this.itemIndex += 10;
    }
  }

  onOKClick() {
    window.history.back();
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
