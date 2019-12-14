import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Listing, Thing } from '@app/domain/models';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CommentsQuery {
  constructor(private http: HttpClient) { }

  execute(article: string) {
    const url = `https://www.reddit.com/comments/${article}.json`;

    const params = new HttpParams()
      .append('limit', '20')
      .append('depth', '1')
      .append('raw_json', '1');

    return this.http.get<Thing[]>(url, { params }).pipe(
      map(x => ({ post: x[0].data.children[0], comments: x[1].data.children }))
    );
  }
}
