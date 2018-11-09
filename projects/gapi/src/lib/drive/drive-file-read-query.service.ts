import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceAccountSignin } from '../auth/service-account-signin-command.service';

@Injectable({ providedIn: 'root' })
export class DriveFileReadQuery {
  constructor(
    private http: HttpClient,
  ) { }

  @ServiceAccountSignin()
  execute(fileId: string) {
    const baseUrl = 'https://www.googleapis.com/drive/v3/files';

    return this.http.get(`${baseUrl}/${fileId}?alt=media`);
  }
}
