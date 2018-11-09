import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper, Result } from 'core';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DrivePermission } from './drive-permission';

@Injectable({ providedIn: 'root' })
export class DrivePermissionsCreateCommand {
  constructor(
    private http: HttpClient
  ) { }

  execute(fileId: string, emailAddress: string, role: DrivePermission.Roles) {
    if (String.isNullOrWhitespace(fileId)) {
      return throwError(Result.CreateErrorResult('Required', 'fileId'));
    }

    if (String.isNullOrWhitespace(emailAddress)) {
      return throwError(Result.CreateErrorResult('Required', 'emailAddress'));
    }

    if (String.isNullOrWhitespace(role)) {
      return throwError(Result.CreateErrorResult('Required', 'roles'));
    }

    const body = { emailAddress, role, type: 'user' };

    const httpParams = new HttpParams()
      .append('sendNotificationEmail', 'false')
      .append('fields', DrivePermission.fields);

    return this.http.post(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, body, { params: httpParams }).pipe(
      map(commandResult => DomainHelper.adapt(DrivePermission, commandResult))
    );
  }
}
