import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './about-us-detail.component.html'
})
export class AboutUsDetailComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onOKClick() {
    window.history.back();
  }
}
