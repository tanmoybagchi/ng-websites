import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Ministries } from '@app/ministries/ministries';
import { EventManagerService, Result } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { MinistriesCurrentQuery } from './ministries-current-query.service';

@Component({
  templateUrl: './ministries.component.html'
})
export class MinistriesComponent implements OnInit {
  errors: any;
  ministryName: string;
  model: Ministries;
  private kind: string;
  sanitizedHeader: SafeHtml;
  sanitizedPurpose: SafeHtml;
  showOverview: boolean;

  constructor(
    private currentQuery: MinistriesCurrentQuery,
    private eventManagerService: EventManagerService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {
    this.model = new Ministries();
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

  private onCurrentQuery(value: Ministries) {
    this.model = value;

    if (this.showOverview) {
      this.sanitizedHeader = this.sanitizer.bypassSecurityTrustHtml(this.model.header);
      return;
    }

    const ministry = this.model.list.find(x => x.name === this.kind);

    this.ministryName = ministry.name;
    this.sanitizedPurpose = this.sanitizer.bypassSecurityTrustHtml(ministry.purpose);
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
