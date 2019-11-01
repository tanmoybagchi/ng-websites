import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app-root.component.html'
})
export class AppRootComponent implements OnInit {
  homepage: boolean;
  ver: string;

  constructor(
    private router: Router,
  ) {
    this.ver = environment.version;
  }

  ngOnInit() {
    this.router.events.subscribe((ev: any) => {
      if (ev instanceof NavigationEnd) {
        this.homepage = ev.url === '/';
      }
    });
  }
}
