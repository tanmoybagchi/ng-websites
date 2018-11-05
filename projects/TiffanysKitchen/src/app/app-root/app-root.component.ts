import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app-root.component.html'
})
export class AppRootComponent implements OnInit {
  homepage: boolean;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.router.events.subscribe((ev: any) => {
      if (ev instanceof NavigationEnd) {
        this.homepage = ev.url === '/';
      }
    });
  }
}
