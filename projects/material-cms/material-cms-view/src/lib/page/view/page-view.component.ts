import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EventManagerService, Result } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SitePages, SITE_PAGES } from '../../site-pages';
import { Page } from '../../page';
import { PageCurrentQuery } from '../queries/page-current-query.service';

@Component({
  selector: 'cms-page-view',
  templateUrl: './page-view.component.html'
})
export class PageViewComponent implements OnInit {
  errors: any;
  name = '';
  notFound = false;

  private _content: HTMLElement;
  @ViewChild('content')
  public set content(v: ElementRef) {
    if (v === undefined || v === null) {
      this._content = null;
    } else {
      this._content = v.nativeElement;
    }
  }

  constructor(
    @Inject(SITE_PAGES) private sitePages: SitePages,
    private eventManagerService: EventManagerService,
    private pageCurrentQuery: PageCurrentQuery,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => this.onParams(params));
  }

  private onParams(params: ParamMap) {
    const kind = params.get('kind');
    this.name = kind;

    const knownPage = this.sitePages.list.filter(p => p.link === kind);
    if (knownPage.length !== 1) {
      this.notFound = true;
      this.name = 'Page Not Found';
      return;
    }

    this.name = knownPage[0].name;

    this.eventManagerService.raise(ShowThrobberEvent);

    this.pageCurrentQuery.execute(kind).pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.onCurrentQuery(_));
  }

  private onCurrentQuery(page: Page) {
    // tslint:disable-next-line:no-unused-expression
    this._content && (this._content.innerHTML = <string>page.content);
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
