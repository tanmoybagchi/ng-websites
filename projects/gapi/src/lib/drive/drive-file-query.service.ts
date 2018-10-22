import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DriveFileQuery {
  constructor(
    private http: HttpClient,
  ) { }

  execute(fileId: string) {
    const baseUrl = 'https://www.googleapis.com/drive/v3/files';

    return this.http.get(`${baseUrl}/${fileId}?alt=media`);
  }
}
