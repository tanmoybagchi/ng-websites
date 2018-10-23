import { Injectable } from '@angular/core';
import { DriveFileSearchQuery } from '../drive/drive-file-search-query.service';

@Injectable({ providedIn: 'root' })
export class SheetsSearchQuery {
  constructor(
    private driveFilesQuery: DriveFileSearchQuery
  ) { }

  execute(name: string) {
    return this.driveFilesQuery.execute(name, null, 'application/vnd.google-apps.spreadsheet');
  }
}
