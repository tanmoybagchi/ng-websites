import { Injectable } from '@angular/core';
import { DriveFileSearchQuery } from './drive-file-search-query.service';

@Injectable({ providedIn: 'root' })
export class DriveFolderSearchQuery {
  constructor(
    private driveFileSearchQuery: DriveFileSearchQuery
  ) {  }

  execute(name: string, parentId: string = null) {
    return this.driveFileSearchQuery.execute(name, parentId, 'mimeType = \'application/vnd.google-apps.folder\'', true);
  }
}
