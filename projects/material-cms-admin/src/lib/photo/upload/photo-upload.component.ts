import { Component, ElementRef, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Result } from 'core';
import { Page, PageDatabase, PAGE_DATABASE, Photo, PhotoContent } from 'material-cms-view';
import { concat, EMPTY, of, zip } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AssetUploader, ASSET_UPLOADER } from '../../asset-uploader';
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
    const fileHandlers = Array.from(this.files)
      .filter(file => this.isPhoto(file))
      .map(photo => this.previewPhoto(photo))
      .map(photo => this.processAndUpload(photo));

    concat(...fileHandlers).subscribe();
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

    return file;
  }

  private processAndUpload(photoToUpload: File) {
    return of(photoToUpload).pipe(
      switchMap(p => this.compress(p)),
      switchMap(p => this.resize(p)),
      switchMap(p => this.upload(p)),
      switchMap(p => this.saveMetadata(p)),
      tap(_ => photoToUpload['isUploading'] = false),
      take(1)
    );
  }

  private compress(photo: File) {
    return this.photoCompressor.compress(photo);
  }

  private resize(compressedPhoto: PhotoCompressor.Result) {
    const resizers$ = Photo.SIZES.map(size => this.photoResizer.resize(compressedPhoto, size));

    return zip(...resizers$).pipe(
      map(resizedPhotos => resizedPhotos.filter(p => p.width || p.height)),
    );
  }

  private upload(photos: PhotoResizer.Result[]) {
    const upload$ = photos.map(photo => this.assetUploader.uploadPhoto(photo.file).pipe(
      map(uploadResult => ({
        height: photo.height,
        width: photo.width,
        fileName: photo.file.name,
        location: uploadResult.location
      }))
    ));

    return zip(...upload$);
  }

  private saveMetadata(photos: { height: number; width: number; fileName: string; location: string; }[]) {
    const page = new Page<PhotoContent[]>();
    page.kind = 'photo';
    page.status = 'Approved';
    page.effectiveFrom = new Date();
    page.content = photos.map(photo => {
      const res = new PhotoContent();
      res.fileName = photo.fileName;
      res.height = photo.height;
      res.location = photo.location;
      res.width = photo.width;
      return res;
    });

    return this.pageDatabase.add(page);
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
