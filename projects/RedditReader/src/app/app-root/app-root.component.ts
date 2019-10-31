import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'rr-app-root',
  templateUrl: './app-root.component.html'
})
export class AppRootComponent {
  ver: string;

  constructor() {
    this.ver = environment.version;
  }
}
