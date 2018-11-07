import { Component, OnInit } from '@angular/core';
import { convertToParamMap } from '@angular/router';
import { PageListBase, PageListItem } from '../page/page-list-base';
import { AdminAnnouncement } from './admin-announcement';

@Component({
  templateUrl: './admin-announcement-list.component.html'
})
export class AdminAnnouncementListComponent extends PageListBase<AdminAnnouncement, PageListItem> implements OnInit {
  model = new AdminAnnouncement();
  displayedColumns = ['effectiveFrom', 'effectiveTo', 'status', 'action'];

  ngOnInit() {
    this.onParams(convertToParamMap({ kind: 'announcement' }));
  }
}
