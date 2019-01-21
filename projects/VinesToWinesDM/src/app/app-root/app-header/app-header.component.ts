import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { MySitePages } from '@app/shared/my-site-pages';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent implements OnInit {
  pages: { link: string; name: string; width: number; }[];
  menu: { link: string; name: string; width: number; }[];
  overflowMenu: { link: string; name: string; width: number; }[];

  private _menuBarEl: HTMLElement = null;
  @ViewChild('menuBar')
  public set editor(v: ElementRef) {
    if (v === undefined || v === null) {
      this._menuBarEl = null;
    } else {
      this._menuBarEl = v.nativeElement;
    }
  }

  private maxWidth: number;
  private readonly overflowWidth = 40;

  xs = window.screen.width < 600;

  constructor() { }

  ngOnInit() {
    const pages = new MySitePages();
    this.pages = pages.list.filter(p => p.width).map(p => ({ link: p.link, name: p.name, width: p.width }));
    this.maxWidth = this.pages.reduce((a, b) => a + b.width, 0);

    this.setMenu();
  }

  @HostListener('window:resize')
  setMenu() {
    this.xs = window.screen.width < 600;

    const containerWidth = this._menuBarEl.clientWidth - 32;
    if (this.maxWidth < containerWidth) {
      this.menu = this.pages;
      this.overflowMenu = null;
      return;
    }

    let availWidth = containerWidth - this.overflowWidth;
    this.menu = [];
    this.overflowMenu = [];

    this.pages.forEach(p => {
      if (p.width < availWidth) {
        availWidth -= p.width;
        this.menu.push(p);
      } else {
        availWidth = 0;
        this.overflowMenu.push(p);
      }
    });
  }
}
