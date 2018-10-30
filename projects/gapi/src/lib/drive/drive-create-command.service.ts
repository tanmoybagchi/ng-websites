import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomainHelper, Result } from 'core';
import { throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DriveMimeTypes } from './drive-mime-types';

@Injectable({ providedIn: 'root' })
export class DriveCreateCommand {
  constructor(
    private http: HttpClient
  ) { }

  execute(fileName: string, mimeType?: DriveMimeTypes) {
    if (String.isNullOrWhitespace(fileName)) {
      return throwError(Result.CreateErrorResult('Required', 'filename'));
    }

    const body = { name: fileName };
    if (mimeType) {
      (body as any).mimeType = mimeType;
    }

    const httpParams = new HttpParams()
      .append('fields', 'id,name,modifiedTime,version');

    return this.http.post('https://www.googleapis.com/drive/v3/files', body, { params: httpParams }).pipe(
      map(_ => DomainHelper.adapt(DriveCreateCommand.Result, _))
    );
  }
}

export namespace DriveCreateCommand {
  // tslint:disable-next-line:no-shadowed-variable
  export class Result {
    id = '';
    name = '';
    @Reflect.metadata('design:type', Date)
    modifiedTime: Date = null;
    version = 0;
  }
}
