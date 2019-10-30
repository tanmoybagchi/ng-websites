import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Listing, Thing } from '@app/domain/models';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SubredditQuery {
  constructor(private http: HttpClient) { }

  execute(subReddit?: string, after?: string, modhash?: string) {
    const url = 'https://www.reddit.com/' +
      (String.hasData(subReddit) ? `r/${subReddit}/` : '') +
      'hot.json';

    let params = new HttpParams().append('limit', '10').append('raw_json', '1');
    // tslint:disable-next-line:no-unused-expression
    String.hasData(after) && (params = params.append('after', after));
    // tslint:disable-next-line:no-unused-expression
    String.hasData(modhash) && (params = params.append('modhash', modhash));

    return this.http.get<Thing>(url, { params }).pipe(
      filter(httpResult => httpResult.kind === Thing.Kind.Listing),
      map(httpResult => httpResult.data as Listing)
    );
  }
}
