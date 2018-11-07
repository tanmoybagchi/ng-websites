import { Component, OnInit } from '@angular/core';
import { convertToParamMap } from '@angular/router';
import { PageListBase, PageListItem } from '../page/page-list-base';
import { AdminCaller } from './admin-caller';

@Component({
  templateUrl: './admin-caller-list.component.html'
})
export class AdminCallerListComponent extends PageListBase<AdminCaller, PageListItem> implements OnInit {
  displayedColumns = ['effectiveFrom', 'status', 'title', 'action'];

  ngOnInit() {
    this.onParams(convertToParamMap({ kind: 'caller' }));
  }

  setFullList(list: AdminCaller[]) {
    this.fullList = list.map(x => new AdminCallerListItem(x));
  }
}

export class AdminCallerListItem extends PageListItem {
  title: string;

  constructor(model: AdminCaller) {
    super(model);

    if (typeof(model.content) === 'string') {
      model.content = String.hasData(model.content) ? JSON.parse(model.content) : null;
    }

    if (model.content && String.hasData(model.content.title)) {
      this.title = model.content.title;
    }
  }
}
