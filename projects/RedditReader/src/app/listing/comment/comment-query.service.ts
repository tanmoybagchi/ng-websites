import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Listing, Thing } from '@app/domain/models';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CommentQuery {
  constructor(private http: HttpClient) { }

  execute(article: string) {
    const url = `https://www.reddit.com/comments/${article}.json`;

    const params = new HttpParams()
      .append('limit', '10')
      .append('depth', '3')
      .append('raw_json', '1');

    return this.http.get<Thing[]>(url, { params }).pipe(
      map(x => ({ post: x[0].data, comments: x[1].data }))
    );
  }
}
