import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  templateUrl: './admin-events.component.html'
})
export class AdminEventsComponent {
  constructor() { }

  onOKClick() {
    window.location.href = environment.gcalendar;
  }
}
