import { Location } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { SessionStorageService } from 'core';

@Component({
  selector: 'rr-app-root',
  templateUrl: './app-root.component.html'
})
export class AppRootComponent implements OnInit {
  // private lastPoppedUrl: string;

  public get lastPoppedUrl(): string {
    return this.sessionStorageService.get('lastUrl');
  }
  public set lastPoppedUrl(v: string) {
    this.sessionStorageService.set('lastUrl', v);
  }

  public get yScrollStack(): number {
    return this.sessionStorageService.get('yScrollStack');
  }
  public set yScrollStack(v: number) {
    this.sessionStorageService.set('yScrollStack', v);
  }


  constructor(
    private location: Location,
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) {
  }

  ngOnInit() {
    this.location.subscribe(ev => {
      this.lastPoppedUrl = ev.url || '/';
    });

    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationStart) {
        // tslint:disable-next-line:no-unused-expression
        ev.url !== this.lastPoppedUrl && (this.yScrollStack = window.scrollY);

        return;
      }

      if (ev instanceof NavigationEnd) {
        if (ev.url === this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          setTimeout(() => {
            window.scrollTo(0, this.yScrollStack);
          }, 500);
          return;
        }

        window.scrollTo(0, 0);
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(ev) {
    this.lastPoppedUrl = window.location.pathname;
    this.yScrollStack = window.scrollY;
  }
}
