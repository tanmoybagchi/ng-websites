import { Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { PageCurrentQuery } from 'material-cms-view';
import { map } from 'rxjs/operators';
import { AboutUs } from './about-us';

@Injectable({ providedIn: 'root' })
export class AboutUsCurrentQuery {
  constructor(
    private pageCurrentQuery: PageCurrentQuery,
  ) { }

  execute() {
    return this.pageCurrentQuery.execute('about-us').pipe(
      map(page => DomainHelper.adapt(AboutUs, page.content))
    );
  }
}
