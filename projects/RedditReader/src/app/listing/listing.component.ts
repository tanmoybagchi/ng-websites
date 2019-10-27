import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventManagerService, Result } from 'core/core';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { EMPTY } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { ListingQuery } from './listing-query.service';
import { ListingViewModel } from './listing-view-model';

@Component({
  selector: 'rr-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingComponent implements OnInit {
  errors: any;
  before: string;
  after: string;
  modhash: string;
  vm: ListingViewModel[] = [];
  hasPosts = true;

  constructor(
    private eventManagerService: EventManagerService,
    private listingQuery: ListingQuery,
    private sanitizer: DomSanitizer,
    private changeDetector: ChangeDetectorRef
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
    this.vm = vm;
    this.hasPosts = vm.length > 0;
    this.changeDetector.markForCheck();

    setTimeout(() => {
      this.changeDetector.markForCheck();
    }, 0);

    console.table(this.vm.map(x => ({ c: x.createdOn, t: x.title, txt: x.hasText, img: x.hasImage, vdo: x.hasVideo, emb: x.hasEmbed })));
  }

  private onError(result: Result) {
    console.log(result);
    this.errors = result.errors;
    this.changeDetector.markForCheck();
    return EMPTY;
  }
}
