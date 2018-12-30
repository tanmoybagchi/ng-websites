import { Component, OnInit } from '@angular/core';
import { convertToParamMap } from '@angular/router';
import { PageListBase, PageListItem } from 'material-cms-admin';
import { AdminNewsletter } from './admin-newsletter';

@Component({
  templateUrl: './admin-newsletter-list.component.html'
})
export class AdminNewsletterListComponent extends PageListBase<AdminNewsletter, PageListItem> implements OnInit {
  displayedColumns = ['effectiveFrom', 'status', 'title', 'action'];

  ngOnInit() {
    this.onParams(convertToParamMap({ kind: 'caller' }));
  }

  setFullList(list: AdminNewsletter[]) {
    this.fullList = list.map(x => new AdminCallerListItem(x));
  }
}

export class AdminCallerListItem extends PageListItem {
  title: string;

  constructor(model: AdminNewsletter) {
    super(model);

    if (typeof(model.content) === 'string') {
      model.content = String.hasData(model.content) ? JSON.parse(model.content) : null;
    }

    if (model.content && String.hasData(model.content.title)) {
      this.title = model.content.title;
    }
  }
}
