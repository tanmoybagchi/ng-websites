import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment';
import { DriveFile, DriveUploadCommand } from 'gapi';
import { AssetUploader } from 'material-cms-admin';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GDriveAssetUploader implements AssetUploader {
  constructor(
    private driveUploadCommand: DriveUploadCommand,
  ) { }

  uploadPhoto(photo: File) {
    return this.driveUploadCommand.execute(photo, env.photoFolder).pipe(
      map(x => this.conv(x))
    );
  }

  uploadDocument(doc: File) {
    return this.driveUploadCommand.execute(doc, env.docFolder).pipe(
      map(x => this.conv(x))
    );
  }

  uploadAudio(audio: File) {
    return this.driveUploadCommand.execute(audio, env.audioFolder).pipe(
      map(x => this.conv(x))
    );
  }

  private conv(x: DriveFile) {
    const res = new AssetUploader.Result();

    res.fileName = x.name;
    res.location = x.webContentLink;

    return res;
  }
}
