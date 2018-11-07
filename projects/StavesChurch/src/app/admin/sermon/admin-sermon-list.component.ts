import { Component, OnInit } from '@angular/core';
import { convertToParamMap } from '@angular/router';
import { PageListBase, PageListItem } from '../page/page-list-base';
import { AdminSermon } from './admin-sermon';

@Component({
  templateUrl: './admin-sermon-list.component.html'
})
export class AdminSermonListComponent extends PageListBase<AdminSermon, PageListItem> implements OnInit {
  displayedColumns = ['effectiveFrom', 'status', 'title', 'action'];

  ngOnInit() {
    this.onParams(convertToParamMap({ kind: 'sermon' }));
  }

  setFullList(list: AdminSermon[]) {
    this.fullList = list.map(x => new AdminSermonListItem(x));
  }
}

export class AdminSermonListItem extends PageListItem {
  title: string;

  constructor(model: AdminSermon) {
    super(model);

    if (typeof(model.content) === 'string') {
      model.content = String.hasData(model.content) ? JSON.parse(model.content) : null;
    }

    if (model.content && String.hasData(model.content.title)) {
      this.title = model.content.title;
    }
  }
}
