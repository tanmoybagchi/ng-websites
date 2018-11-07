import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AdminPages } from '../admin-pages';

@Component({
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  userName = '';
  pages = new AdminPages();

  constructor() { }

  ngOnInit() {
    this.userName = environment.login_name;
  }
}
