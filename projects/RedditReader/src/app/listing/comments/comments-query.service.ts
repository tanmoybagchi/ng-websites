import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Listing, Thing } from '@app/domain/models';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CommentsQuery {
  constructor(private http: HttpClient) { }

  execute(article: string, comment?: string) {
    const url = `https://www.reddit.com/comments/${article}.json`;

    let params = new HttpParams()
      .append('limit', '20')
      .append('raw_json', '1');

    if (String.isNullOrWhitespace(comment)) {
      params = params.append('depth', '1');
    } else {
      params = params
        .append('threaded', 'false')
        .append('comment', comment);
    }

    return this.http.get<Thing[]>(url, { params }).pipe(
      map(x => ({ post: x[0].data.children[0], comments: x[1].data.children }))
    );
  }
}
