import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Result } from 'core';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DrivePermissionsReadQuery {
  constructor(
    private http: HttpClient
  ) { }

  execute(fileId: string) {
    if (String.isNullOrWhitespace(fileId)) {
      return throwError(Result.CreateErrorResult('Required', 'fileId'));
    }

    const httpParams = new HttpParams()
      .append('fields', 'permissions(emailAddress,role)');

    return this.http.get(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, { params: httpParams });
  }
}
