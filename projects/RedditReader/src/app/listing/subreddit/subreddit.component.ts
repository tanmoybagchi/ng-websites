import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EventManagerService, Result } from 'core/core';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { SubredditQuery } from './subreddit-query.service';
import { SubredditViewModel } from './subreddit-view-model';

@Component({
  selector: 'rr-subreddit',
  templateUrl: './subreddit.component.html',
  styleUrls: ['./subreddit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubredditComponent implements OnInit {
  errors: any;
  vm$: Observable<SubredditViewModel>;
  @Input() subreddit: string;
  private before: string;
  private after: string;
  private modhash: string;

  constructor(
    private eventManagerService: EventManagerService,
    private query: SubredditQuery,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.getPosts(this.subreddit);
  }

  next() {
    this.getPosts(this.subreddit, undefined, this.after, this.modhash);
  }

  prev() {
    this.getPosts(this.subreddit, this.before, undefined, this.modhash);
  }

  private getPosts(subReddit?: string, before?: string, after?: string, modhash?: string) {
    this.vm$ = of(this.eventManagerService.raise(ShowThrobberEvent)).pipe(
      switchMap(() => this.query.execute(subReddit, before, after, modhash)),
      tap(listing => {
        this.before = listing.before;
        this.after = listing.after;
        this.modhash = listing.modhash;
      }),
      map(listing => new SubredditViewModel(listing)),
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    );
  }
  private onError(result: Result) {
    console.log(result);
    this.errors = result.errors;
    this.changeDetector.markForCheck();
    return EMPTY;
  }
}
