import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'rr-app-root',
  templateUrl: './app-root.component.html'
})
export class AppRootComponent {
  buildDate: string;
  buildTime: string;

  constructor() {
    const spl = environment.version.split(',');
    this.buildDate = spl[0];
    this.buildTime = spl.length === 2 ? spl[1] : '';
  }
}
