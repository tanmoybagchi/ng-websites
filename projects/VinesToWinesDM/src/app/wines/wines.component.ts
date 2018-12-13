import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EventManagerService, Result } from 'core';
import { Photo, PhotoListQuery } from 'material-cms-view';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { EMPTY } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { Wines } from './wines';
import { WinesCurrentQuery } from './wines-current-query.service';

@Component({
  templateUrl: './wines.component.html'
})
export class WinesComponent implements OnInit {
  errors: any;
  model: Wines;
  sanitizedDescription: SafeHtml;
  showOverview: boolean;
  wineName: string;

  constructor(
    private currentQuery: WinesCurrentQuery,
    private eventManagerService: EventManagerService,
    private photoListQuery: PhotoListQuery,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {
    this.model = new Wines();
    this.showOverview = true;
  }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.currentQuery.execute().pipe(
      tap(qr => this.setModel(qr)),
      switchMap(_ => this.photoListQuery.execute()),
      tap(photos => this.setPhotos(photos)),
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

  private setModel(value: Wines) {
    this.model = value;

    this.model.wineTypes.forEach(wt => {
      wt.wines.filter(w => String.hasData(w.description)).forEach(w => {
        (w as any).sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(w.description);
      });
    });
  }

  private setPhotos(photos: Photo[]) {
    this.model.wineTypes.forEach(wt => {
      wt.wines.filter(w => w.photoId > 0).forEach(w => {
        const photo = photos.find(p => p.id === w.photoId);
        // tslint:disable-next-line:no-unused-expression
        photo && ((w as any).photo = photo.smallThumbnail);
      });
    });
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
