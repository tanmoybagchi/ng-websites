import { Component, ElementRef, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Result } from 'core';
import { EMPTY, from, zip } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { AssetUploader, ASSET_UPLOADER } from '../../asset-uploader';
import { Page } from '../../page';
import { PageDatabase, PAGE_DATABASE } from '../../page-database';
import { Photo, PhotoContent } from '../photo';
import { PhotoCompressor, PHOTO_COMPRESSOR } from './photo-compressor';
import { PhotoResizer, PHOTO_RESIZER } from './photo-resizer';

@Component({
  selector: 'cms-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss']
})
export class PhotoUploadComponent {
  @Output() done = new EventEmitter();
  @ViewChild('newFile') private newFileElRef: ElementRef;
  files: FileList;

  constructor(
    @Inject(PAGE_DATABASE) private pageDatabase: PageDatabase,
    @Inject(PHOTO_COMPRESSOR) private photoCompressor: PhotoCompressor,
    @Inject(PHOTO_RESIZER) private photoResizer: PhotoResizer,
    @Inject(ASSET_UPLOADER) private assetUploader: AssetUploader,
    private sanitizer: DomSanitizer,
  ) { }

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
    from(this.files).pipe(
      filter(file => this.isPhoto(file)),
      tap(file => this.previewPhoto(file)),
      switchMap(file => this.photoCompressor.compress(file)),
      map(photo => Photo.SIZES.map(size => ({ photo, size }))),
      switchMap(photos => zip(...photos.map(x => this.photoResizer.resize(x.photo, x.size)))),
      map(photos => photos.filter(p => p.width || p.height)),
      switchMap(photos => zip(...photos.map(x => this.assetUploader.uploadPhoto(x.file).pipe(
        map(_ => ({ height: x.height, width: x.width, fileName: x.file.name, location: _.location, lastModified: x.file.lastModified }))
      )))),
      map(photos => {
        const model = new Page<PhotoContent[]>();

        model.kind = 'photo';
        model.status = 'Approved';
        model.effectiveFrom = new Date();
        model.content = photos.map(photo => {
          const res = new PhotoContent();

          res.fileName = photo.fileName;
          res.height = photo.height;
          res.location = photo.location;
          res.width = photo.width;

          return res;
        });

        return { model, lastModified: photos[0].lastModified };
      }),
      switchMap(x => this.pageDatabase.add(x.model).pipe(map(_ => ({ ..._, lastModified: x.lastModified })))),
      tap(x => {
        const file = Array.from(this.files).find(f => f.lastModified === x.lastModified);
        if (file) {
          file['isUploading'] = false;
        }
      })
    ).subscribe();
  }

  private isPhoto(file: File) {
    if (!file.type.startsWith('image')) {
      this.onError(Result.CreateErrorResult('This is not a photo.'), file);
      return false;
    }

    return true;
  }

  private previewPhoto(file: File) {
    file['isUploading'] = true;
    file['objectUrl'] = window.URL.createObjectURL(file);
    file['previewUrl'] = this.sanitizer.bypassSecurityTrustUrl(file['objectUrl']);
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
