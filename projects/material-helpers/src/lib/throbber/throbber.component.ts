import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { EventManagerService } from 'core';
import { filter } from 'rxjs/operators';
import { HideThrobberEvent, ShowThrobberEvent } from './throbber-events';

@Component({
  selector: 'throbber',
  templateUrl: './throbber.component.html',
  styleUrls: ['./throbber.component.scss']
})
export class ThrobberComponent {
  private requestCount = 0;
  private delay = 500;
  private waitingOnServer = false;

  show = false;

  constructor(
    private router: Router,
    eventManagerService: EventManagerService,
  ) {
    this.router.events.pipe(
      filter(ev => ev instanceof NavigationStart)
    ).subscribe(_ => this.waitStart());

    eventManagerService.handle(ShowThrobberEvent).subscribe(_ => this.waitStart());

    this.router.events.pipe(
      filter(ev => ev instanceof NavigationCancel || ev instanceof NavigationEnd || ev instanceof NavigationError)
    ).subscribe(_ => this.waitEnd());

    eventManagerService.handle(HideThrobberEvent).subscribe(_ => this.waitEnd());
  }

  waitStart() {
    this.requestCount++;
    this.waitingOnServer = true;

    window.setTimeout(() => {
      if (!this.waitingOnServer) {
        return;
      }

      this.show = true;
    }, this.delay);
  }

  waitEnd() {
    this.requestCount--;

    this.requestCount === 0 && (this.show = false);

    this.waitingOnServer = false;
  }
}
