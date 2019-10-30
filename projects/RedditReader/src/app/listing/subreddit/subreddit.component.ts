import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  subreddit = 'all';
  private after: string;
  private modhash: string;

  constructor(
    private eventManagerService: EventManagerService,
    private query: SubredditQuery,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      tap(params => params.has('subreddit') && (this.subreddit = params.get('subreddit'))),
      switchMap(() => this.route.queryParamMap),
      tap(queryParams => this.after = queryParams.get('after')),
      tap(queryParams => this.modhash = queryParams.get('modhash')),
      tap(() => this.getPosts(this.subreddit, this.after, this.modhash)),
    ).subscribe();
  }

  private getPosts(subReddit?: string, after?: string, modhash?: string) {
    this.vm$ = of(this.eventManagerService.raise(ShowThrobberEvent)).pipe(
      switchMap(() => this.query.execute(subReddit, after, modhash)),
      map(listing => new SubredditViewModel(listing)),
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    );

    // Needed when user presses the back button on the browser.
    this.changeDetector.markForCheck();
  }

  private onError(result: Result) {
    console.log(result);
    this.errors = result.errors;
    this.changeDetector.markForCheck();
    return EMPTY;
  }
}
