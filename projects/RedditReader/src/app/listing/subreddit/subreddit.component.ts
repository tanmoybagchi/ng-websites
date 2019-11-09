import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { Result } from 'core';
import { Observable, of } from 'rxjs';
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

  newSubreddit = '';
  @ViewChild('newSubredditDialog', { static: true }) newSubredditDialog: any;
  dialogRef: any;

  constructor(
    private query: SubredditQuery,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.vm$ = this.route.paramMap.pipe(
      tap(params => {
        this.errors = undefined;

        if (params.has('subreddit')) {
          this.subreddit = params.get('subreddit');
        }

        this.isLoading = true;
        this.changeDetector.detectChanges();
      }),
      switchMap(() => this.route.queryParamMap),
      map(queryParams => ({ a: queryParams.get('after'), m: queryParams.get('modhash') })),
      tap(() => { this.isLoading = true; this.changeDetector.markForCheck(); }),
      switchMap(p => this.query.execute(this.subreddit, p.a, p.m).pipe(catchError(err => this.onQueryError(err)))),
      map(listing => new SubredditViewModel(listing)),
      tap(() => this.isLoading = false),
    );
  }

  onNewSubreddit() {
    this.dialogRef = this.dialog.open(this.newSubredditDialog, { width: '80vw' });

    this.dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.router.navigate(['/r', this.newSubreddit]);
      }
    });
  }

  onSubmit() {
    this.dialogRef.close(true);
  }

  private onQueryError(result: Result) {
    // tslint:disable-next-line:no-unused-expression
    !environment.production && console.log(result);

    if (!(result instanceof Result)) {
      this.errors = Result.CreateErrorResult('Unknown error').errors;
      return of(null);
    }

    if (!result.returnValue) {
      this.errors = result.errors;
      return of(null);
    }

    const redditError: any = result.returnValue;
    this.errors = Result.CreateErrorResult(`${redditError.message}: ${redditError.reason}`).errors;
    return of(null);
  }
}
