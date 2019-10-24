import { Component, OnInit } from '@angular/core';
import { EventManagerService, Result } from 'core/core';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { EMPTY } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
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
  ) {
  }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.listingQuery.execute('hmmm').pipe(
      tap(listing => this.before = listing.before),
      tap(listing => this.after = listing.after),
      tap(listing => this.modhash = listing.modhash),
      map(listing => listing.children.map(thing => new ListingViewModel(thing))),
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(vm => this.onQuery(vm));
  }

  onQuery(vm: ListingViewModel[]) {
    this.vm = vm.filter(x => !x.stickied);
    console.table(this.vm.map(x => ({ t: x.title, isT: x.isText, isI: x.isImage, isV: x.isVideo })));
  }

  private onError(result: Result) {
    console.log(result);
    this.errors = result.errors;
    return EMPTY;
  }
}
