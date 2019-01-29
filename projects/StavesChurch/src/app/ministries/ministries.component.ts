import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EventManagerService, Result, ScrollService, UniqueIdService } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { EMPTY } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Ministries } from './ministries';
import { MinistriesCurrentQuery } from './ministries-current-query.service';

@Component({
  styleUrls: ['./ministries.component.scss'],
  templateUrl: './ministries.component.html'
})
export class MinistriesComponent implements OnInit {
  errors: any;
  model: Ministries;
  sanitizedHeader: SafeHtml;
  showContent: boolean;

  constructor(
    private currentQuery: MinistriesCurrentQuery,
    private eventManagerService: EventManagerService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private uniqueIdService: UniqueIdService,
    private scrollService: ScrollService,
  ) {
    this.model = new Ministries();
    this.showContent = false;
  }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.currentQuery.execute().pipe(
      tap(qr => this.model = qr),
      tap(qr => this.sanitizedHeader = this.sanitizer.bypassSecurityTrustHtml(this.model.header)),
      tap(qr => this.model.list.forEach(x => {
        (x as any).id = this.uniqueIdService.getUniqueId();
        (x as any).sanitizedPurpose = this.sanitizer.bypassSecurityTrustHtml(x.purpose);
      })),
      tap(qr => this.showContent = true),
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe();
  }

  onContentClick($event: MouseEvent) {
    const target = $event.target;

    if (target instanceof Element && target.hasAttribute('routerLink')) {
      $event.preventDefault();

      const routerLink = target.getAttribute('routerLink');
      this.router.navigate([routerLink]);
      return;
    }
  }

  onOKClick() {
    window.history.back();
  }

  afterExpand($event) {
    this.scrollService.smoothScroll(document.getElementById($event));
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
