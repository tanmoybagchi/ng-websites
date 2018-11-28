import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EventManagerService, Result } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Wines } from './wines';
import { WinesCurrentQuery } from './wines-current-query.service';

@Component({
  templateUrl: './wines.component.html'
})
export class WinesComponent implements OnInit {
  errors: any;
  model: Wines;
  private kind: string;
  sanitizedDescription: SafeHtml;
  sanitizedHeader: SafeHtml;
  showOverview: boolean;
  wineName: string;

  constructor(
    private currentQuery: WinesCurrentQuery,
    private eventManagerService: EventManagerService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {
    this.model = new Wines();
    this.showOverview = true;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => this.onParams(params));
  }

  private onParams(params: ParamMap) {
    if (params.has('kind')) {
      this.kind = params.get('kind');
      this.showOverview = false;
    } else {
      this.kind = null;
      this.showOverview = true;
    }

    this.eventManagerService.raise(ShowThrobberEvent);

    this.currentQuery.execute().pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.onCurrentQuery(_));
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

  private onCurrentQuery(value: Wines) {
    this.model = value;

    if (this.showOverview) {
      this.sanitizedHeader = this.sanitizer.bypassSecurityTrustHtml(this.model.header);
      return;
    }

    const wines = this.model.reds.concat(this.model.whites).concat(this.model.speciality);

    const wine = wines.find(x => x.name === this.kind);

    this.wineName = wine.name;
    this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(wine.description);
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
