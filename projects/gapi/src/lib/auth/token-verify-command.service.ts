import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { GoogleAccessToken } from './google-access-token';

@Injectable({ providedIn: 'root' })
export class TokenVerifyCommand {
  private url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=';

  constructor(
    private http: HttpClient,
  ) { }

  execute(token: GoogleAccessToken) {
    return this.http.post<TokenVerifyCommand.Result>(`${this.url}${token.access_token}`, null).pipe(
      map(x => TokenVerifyCommand.Result.convertFromJson(x))
    );
  }
}

export namespace TokenVerifyCommand {
  export class Result {
    aud = '';
    expires_in = 3600;
    scope = '';
    userid = '';

    static convertFromJson(item: TokenVerifyCommand.Result) {
      if (typeof item.expires_in === 'string') {
        item.expires_in = String.hasData(item.expires_in) ? Number(item.expires_in) : null;
      }

      return item;
    }
  }
}
