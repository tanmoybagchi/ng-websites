import { Component, OnInit } from '@angular/core';
import { Pages } from '@app/page/pages';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent implements OnInit {
  menu: { link: string; name: string; }[];

  constructor() { }

  ngOnInit() {
    const pages = new Pages();
    this.menu = pages.list.slice(1);
  }
}
