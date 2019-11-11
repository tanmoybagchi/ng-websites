import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'rr-app-root',
  templateUrl: './app-root.component.html'
})
export class AppRootComponent implements OnInit {
  buildDate: string;
  buildTime: string;

  constructor() {
    if (environment.production) {
      const spl = environment.version.split(',');
      this.buildDate = spl[0];
      // tslint:disable-next-line:no-unused-expression
      spl.length > 1 && (this.buildTime = spl[1]);
      return;
    }

    const now = new Date();
    this.buildDate = now.toLocaleDateString();
    this.buildTime = now.toLocaleTimeString();
  }

  ngOnInit() {
    // Install built-in polyfills to patch browser incompatibilities.
    (window as any).shaka.polyfill.installAll();
  }
}
