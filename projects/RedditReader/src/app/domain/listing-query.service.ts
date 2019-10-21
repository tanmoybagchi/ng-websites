import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper } from 'core';
import { map, filter } from 'rxjs/operators';
import { Thing } from './models';

@Injectable({ providedIn: 'root' })
export class ListingQuery {
  constructor(
    private http: HttpClient
  ) { }

  execute(subReddit: string) {
    return this.http.get<Thing>(`https://www.reddit.com/r/${subReddit}/hot.json?limit=10`)/* .pipe(
      map(httpResult => {
        const res = DomainHelper.adapt(Thing, httpResult);

        switch (httpResult.kind) {
          case Thing.Kind.Listing:

            break;

          default:
            break;
        }
        const listing = DomainHelper.adapt(Listing, httpResult);

        listing.children = httpResult.children.map(x => DomainHelper.adapt(Link, x.data));

        return res;
      })
    ) */;
  }
}
