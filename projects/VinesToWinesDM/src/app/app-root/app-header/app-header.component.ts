import { Component, OnInit } from '@angular/core';
import { MySitePages } from '@app/shared/my-site-pages';

@Component({
  selector: 'app-header',
  styleUrls: ['./app-header.component.scss'],
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent implements OnInit {
  menu: { link: string; name: string; }[];

  constructor() { }

  ngOnInit() {
    const pages = new MySitePages();
    this.menu = pages.list;
  }
}
