import { Component, OnInit, Inject } from '@angular/core';
import { environment } from '@env/environment';
import { SITE_PAGES, SitePages } from 'material-cms-view';

@Component({
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  userName = '';
  adminPages: { link: string; name: string; }[];

  constructor(
    @Inject(SITE_PAGES) sitePages: SitePages,
  ) {
    this.adminPages = sitePages.list.sort((a, b) => a.name.localeCompare(b.name));
  }

  ngOnInit() {
    this.userName = environment.g_oauth_login_name;
  }
}
