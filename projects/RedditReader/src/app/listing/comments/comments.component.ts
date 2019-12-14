import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { Result } from 'core';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { CommentsQuery } from './comments-query.service';

@Component({
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentsComponent implements OnInit {
  errors: any;
  vm$: Observable<{ post: any, comments: any }>;
  isLoading = true;
  article: string;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private commentsQuery: CommentsQuery,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.vm$ = this.route.paramMap.pipe(
      tap(params => {
        this.errors = undefined;

        if (params.has('article')) {
          this.article = params.get('article');
        }

        window.scrollTo(0, 0);
        this.isLoading = true;
        this.changeDetector.detectChanges();
      }),
      switchMap(p => this.commentsQuery.execute(this.article).pipe(catchError(err => this.onQueryError(err)))),
      tap(() => this.isLoading = false),
    );
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
