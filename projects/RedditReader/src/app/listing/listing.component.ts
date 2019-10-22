import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Thing, Listing } from '@app/domain/models';
import { EventManagerService, Result } from 'core/core';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { EMPTY, from, of, Observable } from 'rxjs';
import { catchError, finalize, tap, map, filter, switchMap } from 'rxjs/operators';
import { ListingQuery } from './listing-query.service';
import { ListingViewModel } from './listing-view-model';

@Component({
  selector: 'rr-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
  errors: any;
  before: string;
  after: string;
  modhash: string;
  vm: ListingViewModel[];

  constructor(
    private eventManagerService: EventManagerService,
    private listingQuery: ListingQuery,
    private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.listingQuery.execute().pipe(
      tap(listing => this.before = listing.before),
      tap(listing => this.after = listing.after),
      tap(listing => this.modhash = listing.modhash),
      map(listing => listing.children.map(thing => new ListingViewModel(thing, this.sanitizer))),
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(vm => this.onQuery(vm));
  }

  onQuery(vm: ListingViewModel[]) {
    console.table(vm);
    this.vm = vm;
  }

  private onError(result: Result) {
    console.log(result);
    this.errors = result.errors;
    return EMPTY;
  }
}
