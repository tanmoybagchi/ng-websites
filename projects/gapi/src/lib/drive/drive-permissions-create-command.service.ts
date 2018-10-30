import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper, Result } from 'core';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DrivePermissionsCreateCommand {
  constructor(
    private http: HttpClient
  ) { }

  execute(fileId: string, emailAddress: string, role: DrivePermissionsCreateCommand.Roles) {
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
      .append('fields', 'id');

    return this.http.post(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, body, { params: httpParams }).pipe(
      map(_ => DomainHelper.adapt(DrivePermissionsCreateCommand.Result, _))
    );
  }
}

export namespace DrivePermissionsCreateCommand {
  export enum Roles {
    owner = 'owner',
    organizer = 'organizer',
    fileOrganizer = 'fileOrganizer',
    writer = 'writer',
    commenter = 'commenter',
    reader = 'reader'
  }

  // tslint:disable-next-line:no-shadowed-variable
  export class Result {
    id = '';
  }
}
