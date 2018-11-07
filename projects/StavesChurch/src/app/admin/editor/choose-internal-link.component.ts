import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Pages } from '@app/page/pages';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'choose-internal-link',
  templateUrl: './choose-internal-link.component.html'
})
export class ChooseInternalLinkComponent implements OnInit {
  pages = new Pages();

  @Output() done = new EventEmitter<{ link: string, name: string }>();

  constructor() { }

  ngOnInit() {
  }

  onLinkClick(item: { link: string, name: string }) {
    this.done.emit(item);
  }

  onOKClick() {
    this.done.emit();
  }
}
