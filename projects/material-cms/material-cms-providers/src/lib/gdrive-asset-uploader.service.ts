import { Inject, Injectable } from '@angular/core';
import { DriveFile, DriveUploadCommand } from 'gapi';
import { AssetUploader } from 'material-cms-admin';
import { map } from 'rxjs/operators';
import { ProviderConfig, PROVIDER_CONFIG } from './provider-config';

@Injectable({ providedIn: 'root' })
export class GDriveAssetUploader implements AssetUploader {
  constructor(
    @Inject(PROVIDER_CONFIG) private env: ProviderConfig,
    private driveUploadCommand: DriveUploadCommand,
  ) { }

  uploadPhoto(photo: File) {
    return this.driveUploadCommand.execute(photo, this.env.photoFolder).pipe(
      map(x => this.conv(x))
    );
  }

  uploadDocument(doc: File) {
    return this.driveUploadCommand.execute(doc, this.env.docFolder).pipe(
      map(x => this.conv(x))
    );
  }

  uploadAudio(audio: File) {
    return this.driveUploadCommand.execute(audio, this.env.audioFolder).pipe(
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
