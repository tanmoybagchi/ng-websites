import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchRedditNamesQuery {
  constructor(private http: HttpClient) { }

  execute(query: string, exact?: boolean, includeOver18?: boolean, typeaheadActive?: boolean, includeUnadvertisable?: boolean) {
    const url = 'https://www.reddit.com/api/search_reddit_names.json';

    let params = new HttpParams().append('query', query);

    // tslint:disable:no-unused-expression
    exact && (params = params.append('exact', 'true'));
    includeOver18 && (params = params.append('include_over_18', 'true'));
    typeaheadActive && (params = params.append('typeahead_active', 'true'));
    includeUnadvertisable && (params = params.append('include_unadvertisable', 'true'));
    // tslint:enable:no-unused-expression

    return this.http.get<{names: string[]}>(url, { params });
  }
}
