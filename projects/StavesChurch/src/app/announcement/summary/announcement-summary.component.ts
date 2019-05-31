import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LocalStorageService, Result } from 'core';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Announcement } from '../announcement';
import { AnnouncementCurrentQuery } from '../announcement-current-query.service';

@Component({
  selector: 'app-announcement-summary',
  templateUrl: './announcement-summary.component.html',
  styleUrls: ['./announcement-summary.component.scss']
})
export class AnnouncementSummaryComponent implements OnInit {
  errors: any;
  model: Announcement[];
  urgent: Announcement;

  @ViewChild('urgentAnnouncement', { static: true }) urgentAnnouncementDialog;

  constructor(
    private announcementCurrentQuery: AnnouncementCurrentQuery,
    private localStorageService: LocalStorageService,
    private router: Router,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.announcementCurrentQuery.execute().pipe(
      catchError(err => this.onError(err))
    ).subscribe(_ => this.onAnnouncementQuery(_));
  }

  onAnnouncementQuery(value: Announcement[]) {
    this.model = value.slice(0, 3);

    this.urgent = value.filter(x => x.content.urgent)[0];

    if (!this.urgent) { return; }

    if (this.localStorageService.get(`urgentAnnouncement.${this.urgent.identifier}`) === null) {
      (this.urgent.content as any).sanitizedDesc = this.sanitizer.bypassSecurityTrustHtml(this.urgent.content.description);

      this.dialog.open(this.urgentAnnouncementDialog);

      this.localStorageService.set(`urgentAnnouncement.${this.urgent.identifier}`, {}, this.urgent.effectiveTo.valueOf());
    }
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

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
