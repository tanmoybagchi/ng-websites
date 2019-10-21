import { Component, OnInit } from '@angular/core';
import { ListingQuery } from '@app/domain/listing-query.service';
import { EventManagerService, Result } from 'core/core';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Thing } from '@app/domain/models';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'rr-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  errors: any;
  thing: Thing;

  constructor(
    private eventManagerService: EventManagerService,
    private listingQuery: ListingQuery,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.listingQuery.execute('popular').pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(thing => this.onListQuery(thing));
  }

  onListQuery(thing: Thing) {
    this.thing = thing;
  }

  sanitize(html: string) {
    this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
