import { Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EventManagerService, Result } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { EMPTY } from 'rxjs';
import { catchError, filter, finalize, tap } from 'rxjs/operators';
import { PageDatabase, PAGE_DATABASE } from '../../page-database';
import { SitePages, SITE_PAGES } from '../../site-pages';

@Component({
  selector: 'cms-page-view',
  templateUrl: './page-view.component.html'
})
export class PageViewComponent implements OnInit {
  errors: any;
  name = '';
  showContent = false;
  sanitizedContent: SafeHtml;

  constructor(
    @Inject(PAGE_DATABASE) private pageDatabase: PageDatabase,
    @Inject(SITE_PAGES) private sitePages: SitePages,
    private eventManagerService: EventManagerService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => this.onParams(params));
  }

  private onParams(params: ParamMap) {
    const kind = params.get('kind');
    if (kind.endsWith('.html') || kind.endsWith('.htm')) {
      this.router.navigate(['/']);
      return;
    }

    this.name = kind;

    const knownPage = this.sitePages.list.filter(p => p.link === kind);
    if (knownPage.length !== 1) {
      this.showContent = true;
      this.name = 'Page Not Found';
      this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml('We couldn\'t find the page you were looking for.');
      return;
    }

    this.name = knownPage[0].name;

    this.eventManagerService.raise(ShowThrobberEvent);

    this.pageDatabase.getCurrentPage(kind).pipe(
      tap(_ => this.showContent = true),
      tap(qr => this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(String.hasData(qr.content)
        ? qr.content
        : 'We couldn\'t find the page you were looking for.')),
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

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
