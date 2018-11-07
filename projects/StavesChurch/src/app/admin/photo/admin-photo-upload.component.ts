import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AdminPageDatabase } from '@app/admin/admin-page-database';
import { PhotoContent } from '@app/photo/photo';
import { Result } from 'core';
import { DriveUploadCommand } from 'gapi';
import { concat, EMPTY, Observable, zip } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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
    const processes: Observable<AdminPhoto>[] = [];

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

      const obs = new Observable<AdminPhoto>(observer => {
        this.adminPhotoProcessCommand.execute(f).pipe(
          switchMap(_ => this.onPhotos(_, f.name)),
          catchError(err => this.onError(err, f))
        ).subscribe(_ => {
          observer.next(_);
          observer.complete();
        });
      });

      processes.push(obs);
    }

    const models: AdminPhoto[] = [];

    concat(...processes).subscribe(x => {
      models.push(x);

      if (models.length < processes.length) {
        return;
      }

      this.adminPageDatabase.addAll(models).subscribe(_ => {
        for (let index = 0; index < this.files.length; index++) {
          const f = this.files[index];
          f['isUploading'] = false;
        }
      });
    });
  }

  private onPhotos(photos: AdminPhotoProcessCommand.Result[], fileName: string) {
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

    return zip(...photos.map(photo => this.driveUploadCommand.execute(photo.file))).pipe(
      map(_ => this.onDriveUploads(_, model))
    );
  }

  private onDriveUploads(upload: DriveUploadCommand.Result[], model: AdminPhoto) {
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
