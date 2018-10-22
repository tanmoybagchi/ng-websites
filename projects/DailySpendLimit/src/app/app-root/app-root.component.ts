import { Location, PopStateEvent } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app-root.component.html'
})
export class AppRootComponent implements OnInit {
  homepage: boolean;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  constructor(
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url || '/';
    });

    this.router.events.subscribe((ev: any) => {
      if (ev instanceof NavigationStart) {
        // tslint:disable-next-line:no-unused-expression
        ev.url !== this.lastPoppedUrl && this.yScrollStack.push(window.scrollY);

        return;
      }

      if (ev instanceof NavigationEnd) {
        this.homepage = ev.url === '/';

        if (ev.url === this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
          return;
        }

        window.scrollTo(0, 0);
      }
    });
  }
}
