import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AdminPageDatabase } from '@app/admin/admin-page-database';
import { PhotoContent } from '@app/photo/photo';
import { environment as env } from '@env/environment';
import { Result } from 'core';
import { DriveFile, DriveUploadCommand, DriveFileSearchQuery } from 'gapi';
import { concat, EMPTY, Observable, zip, from } from 'rxjs';
import { catchError, map, switchMap, tap, filter } from 'rxjs/operators';
import { AdminPhoto } from './admin-photo';
import { AdminPhotoProcessCommand } from './admin-photo-process.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'admin-photo-upload',
  templateUrl: './admin-photo-upload.component.html',
  styleUrls: ['./admin-photo-upload.component.scss']
})
export class AdminPhotoUploadComponent implements OnInit {
  @Output() done = new EventEmitter();
  @ViewChild('newFile') private newFileElRef: ElementRef;
  files: FileList;

  constructor(
    private adminPageDatabase: AdminPageDatabase,
    private adminPhotoProcessCommand: AdminPhotoProcessCommand,
    private driveUploadCommand: DriveUploadCommand,
    private driveFileSearchQuery: DriveFileSearchQuery,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
  }

  onAddNewClick() {
    this.newFileElRef.nativeElement.click();
  }

  onDoneClick() {
    this.done.emit();
  }

  onDragEnter($event: DragEvent) {
    $event.stopPropagation();
    $event.preventDefault();
  }

  onDragOver($event: DragEvent) {
    $event.stopPropagation();
    $event.preventDefault();
  }

  onDrop($event: DragEvent) {
    $event.stopPropagation();
    $event.preventDefault();

    const dt = $event.dataTransfer;
    this.files = dt.files;

    this.handleFiles();
  }

  onNewFileChange($event: Event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.files = (<HTMLInputElement>this.newFileElRef.nativeElement).files;
    if (!this.files.length) {
      return;
    }

    this.handleFiles();
  }

  private handleFiles() {
    const photoProcessors$ = this.setupPhotoProcessers();

    const photos: AdminPhoto[] = [];

    this.driveFileSearchQuery.execute(`${env.rootFolder}\\${env.assetFolder}`, undefined, true).pipe(
      switchMap(_ => concat(...photoProcessors$)),
      tap(x => photos.push(x)),
      filter(x => photos.length >= photoProcessors$.length),
      switchMap(x => this.adminPageDatabase.addAll(photos)),
      tap(_ => {
        for (let index = 0; index < this.files.length; index++) {
          const f = this.files[index];
          f['isUploading'] = false;
        }
      })
    ).subscribe();
  }

  private setupPhotoProcessers() {
    const photoProcessors$: Observable<AdminPhoto>[] = [];

    for (let index = 0; index < this.files.length; index++) {
      const f = this.files[index];

      if (!this.isValidFiletype(f)) {
        const result = new Result();
        result.addError('This is not a photo.');
        f['errors'] = result.errors;
        continue;
      }

      f['isUploading'] = true;
      f['objectUrl'] = window.URL.createObjectURL(f);
      f['previewUrl'] = this.sanitizer.bypassSecurityTrustUrl(f['objectUrl']);

      const photoProcessor$ = new Observable<AdminPhoto>(observer => {
        this.adminPhotoProcessCommand.execute(f).pipe(
          switchMap(_ => this.createAdminPhoto(_, f.name)),
          catchError(err => this.onError(err, f))
        ).subscribe(_ => {
          observer.next(_);
          observer.complete();
        });
      });

      photoProcessors$.push(photoProcessor$);
    }

    return photoProcessors$;
  }

  private createAdminPhoto(photos: AdminPhotoProcessCommand.Result[], fileName: string) {
    const model = new AdminPhoto();
    model.kind = 'photo';
    model.status = 'Approved';
    model.effectiveFrom = new Date();
    model.content = photos.map(photo => {
      const res = new PhotoContent();

      res.height = photo.height;
      res.width = photo.width;

      const fileNameParts = fileName.split('.');
      fileNameParts.pop(); // remove extension
      res.name = fileNameParts.join('.');

      res.fileName = photo.file.name.replace('.jpg', '');

      return res;
    });

    const uploaders$ = photos.map(photo => this.driveUploadCommand.execute(photo.file, `${env.rootFolder}\\${env.assetFolder}`));

    return zip(...uploaders$).pipe(
      map(_ => this.onDriveUploads(_, model))
    );
  }

  private onDriveUploads(upload: DriveFile[], model: AdminPhoto) {
    upload.forEach(x => {
      model.content.find(y => y.fileName === x.name).location = x.webContentLink.replace('&export=download', '');
    });

    return model;
  }

  private isValidFiletype(file: File) {
    return file.type.startsWith('image');
  }

  cleanUp(f: File) {
    window.URL.revokeObjectURL(f['objectUrl']);
  }

  private onError(result: Result, f?: File) {
    f['previewUrl'] = null;
    f['isUploading'] = false;
    f['errors'] = result.errors;
    return EMPTY;
  }
}
