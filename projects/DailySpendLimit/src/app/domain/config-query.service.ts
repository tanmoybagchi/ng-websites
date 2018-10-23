import { Injectable } from '@angular/core';
import { DriveFileSearchQuery, DriveFileQuery } from 'gapi';

@Injectable({
  providedIn: 'root'
})
export class ConfigQuery {
  constructor(
    private driveFileSearchQuery: DriveFileSearchQuery,
    private driveFileQuery: DriveFileQuery
  ) { }

}
