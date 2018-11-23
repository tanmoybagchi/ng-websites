import { Component, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'page-title',
  templateUrl: './page-title.component.html'
})
export class PageTitleComponent {
  @Input() name = '';
}
