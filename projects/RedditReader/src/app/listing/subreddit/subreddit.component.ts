import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManagerService, Result } from 'core/core';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
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
  subreddit = 'popular';
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
    this.vm$ = this.route.paramMap.pipe(
      tap(params => params.has('subreddit') && (this.subreddit = params.get('subreddit'))),
      switchMap(() => this.route.queryParamMap),
      tap(queryParams => {
        this.eventManagerService.raise(ShowThrobberEvent);
        this.after = queryParams.get('after');
        this.modhash = queryParams.get('modhash');
      }),
      switchMap(() => this.query.execute(this.subreddit, this.after, this.modhash)),
      map(listing => new SubredditViewModel(listing)),
      tap(() => {
        window.scrollTo(0, 0);
        this.eventManagerService.raise(HideThrobberEvent);
      }),
      catchError(err => this.onError(err)),
    );
  }

  private onError(result: Result) {
    this.errors = result.errors;
    this.changeDetector.markForCheck();
    this.eventManagerService.raise(HideThrobberEvent)
    return EMPTY;
  }
}
