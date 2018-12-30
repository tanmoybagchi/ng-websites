import { Component, OnInit } from '@angular/core';
import { EventManagerService, Result } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { EMPTY } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Newsletter } from './newsletter';
import { NewsletterCurrentQuery } from './newsletter-current-query.service';

@Component({
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {
  errors: any;
  model: Newsletter[];
  showContent: boolean;

  constructor(
    private callerCurrentQuery: NewsletterCurrentQuery,
    private eventManagerService: EventManagerService,
  ) {
    this.showContent = false;
  }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.callerCurrentQuery.execute().pipe(
      tap(qr => this.model = qr),
      tap(_ => this.showContent = true),
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe();
  }

  onOKClick() {
    window.history.back();
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
