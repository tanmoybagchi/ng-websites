import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'core/core';
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
  isLoading = true;

  constructor(
    private query: SubredditQuery,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.vm$ = this.route.paramMap.pipe(
      tap(params => params.has('subreddit') && (this.subreddit = params.get('subreddit'))),
      switchMap(() => this.route.queryParamMap),
      map(queryParams => ({ a: queryParams.get('after'), m: queryParams.get('modhash') })),
      tap(() => { this.isLoading = true; this.changeDetector.markForCheck(); }),
      switchMap(p => this.query.execute(this.subreddit, p.a, p.m)),
      map(listing => new SubredditViewModel(listing)),
      tap(() => { window.scrollTo(0, 0); this.isLoading = false; }),
      catchError(err => this.onError(err)),
    );
  }

  private onError(result: Result) {
    this.errors = result.errors;
    this.isLoading = false;
    this.changeDetector.markForCheck();
    return EMPTY;
  }
}
