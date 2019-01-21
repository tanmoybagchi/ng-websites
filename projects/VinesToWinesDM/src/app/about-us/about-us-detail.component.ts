import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EventManagerService, Result } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { EMPTY } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AboutUs } from './about-us';
import { AboutUsCurrentQuery } from './about-us-current-query.service';

@Component({
  templateUrl: './about-us-detail.component.html'
})
export class AboutUsDetailComponent implements OnInit {
  errors: any;
  model: AboutUs;
  showContent = false;
  sanitizedContent: SafeHtml;

  constructor(
    private currentQuery: AboutUsCurrentQuery,
    private eventManagerService: EventManagerService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {
    this.model = new AboutUs();
  }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.currentQuery.execute().pipe(
      tap(qr => this.setModel(qr)),
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

  private setModel(value: AboutUs) {
    this.model = value;
    this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.model.detail);
    this.showContent = true;
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
