import { Component } from '@angular/core';

@Component({
  templateUrl: './about-us-detail.component.html'
})
export class AboutUsDetailComponent {
  onOKClick() {
    window.history.back();
  }
}
