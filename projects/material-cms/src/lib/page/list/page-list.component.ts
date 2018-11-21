import { Component } from '@angular/core';
import { Page } from '../../page';
import { PageListBase, PageListItem } from './page-list-base';

@Component({
  selector: 'cms-page-list',
  templateUrl: './page-list.component.html'
})
export class PageListComponent extends PageListBase<Page, PageListItem> {
  model = new Page();
  displayedColumns = ['effectiveFrom', 'status', 'action'];
}
