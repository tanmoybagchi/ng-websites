import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Result } from 'core';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Announcement } from '../announcement';
import { AnnouncementCurrentQuery } from '../announcement-current-query.service';

@Component({
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {
  errors: any;
  model: Announcement[];

  constructor(
    private announcementCurrentQuery: AnnouncementCurrentQuery,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.announcementCurrentQuery.execute().pipe(
      catchError(err => this.onError(err))
    ).subscribe(_ => this.onAnnouncementQuery(_));
  }

  onAnnouncementQuery(value: Announcement[]) {
    this.model = value;
    this.model.forEach(x => (x.content as any).sanitizedDesc = this.sanitizer.bypassSecurityTrustHtml(x.content.description));
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
