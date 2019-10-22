import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Listing, Thing } from '@app/domain/models';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ListingQuery {
  constructor(private http: HttpClient) { }

  execute(subReddit?: string, before?: string, after?: string, modhash?: string) {
    const url = 'https://www.reddit.com/' +
      (String.hasData(subReddit) ? `r/${subReddit}/` : '') +
      'hot.json';

    const paramsObj = { before, after, modhash };

    const params = new HttpParams({ fromObject: paramsObj }).append('limit', '10');

    // tslint:disable-next-line:no-unused-expression
    /* String.hasData(before) && (params = params.append('before', before)); */

    return this.http.get<Thing>(url, { params }).pipe(
      filter(httpResult => httpResult.kind === Thing.Kind.Listing),
      map(httpResult => httpResult.data as Listing)
    );
  }
}
