import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper, Result } from 'core';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DrivePermission } from './drive-permission';

@Injectable({ providedIn: 'root' })
export class DrivePermissionsQuery {
  constructor(
    private http: HttpClient
  ) { }

  execute(fileId: string) {
    if (String.isNullOrWhitespace(fileId)) {
      return throwError(Result.CreateErrorResult('Required', 'fileId'));
    }

    const httpParams = new HttpParams().append('fields', `permissions(${DrivePermission.fields}),nextPageToken`);

    const url = `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`;

    return this.http.get<DrivePermissionsQuery.Result>(url, { params: httpParams }).pipe(
      map(queryResult => {
        const result = DomainHelper.adapt(DrivePermissionsQuery.Result, queryResult);

        result.permissions = queryResult.permissions.map(x => DomainHelper.adapt(DrivePermission, x));

        return result;
      })
    );
  }
}

export namespace DrivePermissionsQuery {
  // tslint:disable-next-line:no-shadowed-variable
  export class Result {
    /** Identifies what kind of resource this is. Value: the fixed string "drive#permissionList". */
    kind = 'drive#permissionList';
    /** The list of permissions. If nextPageToken is populated,
     * then this list may be incomplete and an additional page of results should be fetched. */
    permissions: DrivePermission[] = [];
    /** The page token for the next page of permissions.
     * This field will be absent if the end of the permissions list has been reached.
     * If the token is rejected for any reason, it should be discarded,
     * and pagination should be restarted from the first page of results. */
    nextPageToken: string = null;
  }
}
