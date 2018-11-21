import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { SitePages, SITE_PAGES } from '../site-pages';

@Component({
  selector: 'cms-choose-internal-link',
  templateUrl: './choose-internal-link.component.html'
})
export class ChooseInternalLinkComponent {
  @Output() done = new EventEmitter<{ link: string, name: string; }>();

  constructor(
    @Inject(SITE_PAGES) public sitePages: SitePages,
  ) { }

  onLinkClick(item: { link: string, name: string; }) {
    this.done.emit(item);
  }

  onCancelClick() {
    this.done.emit();
  }
}
