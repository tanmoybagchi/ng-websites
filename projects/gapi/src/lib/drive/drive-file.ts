export class DriveFile {
  static fields = 'id,name,modifiedTime,version,webContentLink';
  static metadataURI = 'https://www.googleapis.com/drive/v3/files';
  static uploadURI = 'https://www.googleapis.com/upload/drive/v3/files';

  id = '';
  name = '';
  @Reflect.metadata('design:type', Date)
  modifiedTime: Date = null;
  version = 0;
  webContentLink = '';
}
