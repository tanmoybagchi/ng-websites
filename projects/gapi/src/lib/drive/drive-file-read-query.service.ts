import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceAccountSignin } from '../auth/service-account-signin-command.service';
import { DriveFile } from './drive-file';

@Injectable({ providedIn: 'root' })
export class DriveFileReadQuery {
  constructor(
    private http: HttpClient,
  ) { }

  @ServiceAccountSignin()
  execute(fileId: string) {
    return this.http.get(`${DriveFile.metadataURI}/${fileId}?alt=media`);
  }
}
