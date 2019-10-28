import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Listing } from '@app/domain/models';
import { EventManagerService, Result } from 'core/core';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
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
  vm = new SubredditViewModel();
  @Input() subreddit: string;

  constructor(
    private eventManagerService: EventManagerService,
    private query: SubredditQuery,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.query.execute(this.subreddit).pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(listing => this.onQuery(listing));
  }

  onQuery(listing: Listing) {
    this.vm = new SubredditViewModel(listing);
    this.changeDetector.markForCheck();
  }

  private onError(result: Result) {
    console.log(result);
    this.errors = result.errors;
    this.changeDetector.markForCheck();
    return EMPTY;
  }
}
