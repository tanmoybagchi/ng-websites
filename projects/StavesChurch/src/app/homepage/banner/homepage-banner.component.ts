import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Photo, PhotoContent } from '@app/photo/photo';
import { PhotoQuery } from '@app/photo/photo-query.service';
import { Result, ScrollbarDimensionService } from 'core';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'homepage-banner',
  templateUrl: './homepage-banner.component.html',
  styleUrls: ['./homepage-banner.component.scss']
})
export class HomepageBannerComponent implements OnInit {
  private _photoIdentifier = '';
  public get photoIdentifier() {
    return this._photoIdentifier;
  }
  @Input()
  public set photoIdentifier(v: string) {
    if (this._photoIdentifier === v) {
      return;
    }

    this._photoIdentifier = v;
    this.getPhotoSizes();
  }

  private _photoTransparency = 0.25;
  public get photoTransparency() {
    return this._photoTransparency;
  }
  @Input()
  public set photoTransparency(v: number) {
    if (this._photoTransparency === v) {
      return;
    }

    this._photoTransparency = v;
    // tslint:disable-next-line:no-unused-expression
    v !== undefined && v !== null && this.setBackgroundImage();
  }

  private _titleColor = 'white';
  public get titleColor() {
    return this._titleColor;
  }
  @Input()
  public set titleColor(v: string) {
    if (this._titleColor === v) {
      return;
    }

    this._titleColor = v;
    // tslint:disable-next-line:no-unused-expression
    String.hasData(v) && this.setBackgroundImage();
  }

  @Input() subTitle = '';
  @Input() title = '';
  @Output() error = new EventEmitter<Result>();

  @ViewChild('bgImage') private containerElRef: ElementRef;

  backgroundImage: SafeStyle;
  private photos: Photo[];
  private photoUrl: string;
  private resizeStream = new Subject<{ height: number, width: number }>();

  constructor(
    private domSanitizer: DomSanitizer,
    private scrollbarDimensionService: ScrollbarDimensionService,
    private photoQuery: PhotoQuery,
  ) { }

  ngOnInit() {
    this.resizeStream.pipe(
      // wait 50ms after each resize
      debounceTime(50),

      // ignore new size if same as previous size
      distinctUntilChanged(),
    ).subscribe(containerWidth => {
      this.onSizesQuery();
    });
  }

  onResize(event) {
    this.resizeStream.next(this.getContainerDimensions());
  }

  private getPhotoSizes() {
    this.photoQuery.execute().pipe(
      catchError(err => this.onError(err))
    ).subscribe(allPhotos => {
      this.photos = allPhotos.filter(x => x.identifier === this._photoIdentifier);
      this.onSizesQuery();
    });
  }

  private onSizesQuery() {
    if (this.photos === null || this.photos === undefined || this.photos.length === 0) {
      this.photoUrl = '';
      return;
    }

    const currentPhoto = this.photos[0];

    const bannerPhotos = currentPhoto.photos().map(x => new BannerPhoto(x));

    this.calcPhotoCoverage(bannerPhotos, this.getContainerDimensions());

    let photo = this.smallestPhotoThatCoversTheContainer(bannerPhotos);
    if (photo === null || photo === undefined) {
      photo = this.photoThatStretchesTheLeast(bannerPhotos);
    }

    if (photo === null || photo === undefined) {
      this.photoUrl = '';
    } else {
      this.photoUrl = photo.location;
    }

    this.setBackgroundImage();
  }

  setBackgroundImage() {
    const color = this._titleColor === 'white' ? '0' : '255';
    const rgba = `rgba(${color}, ${color}, ${color}, ${this._photoTransparency})`;
    const bi = `linear-gradient(${rgba}, ${rgba})${String.hasData(this.photoUrl) ? `, url(${this.photoUrl}` : ''} )`;
    this.backgroundImage = this.domSanitizer.bypassSecurityTrustStyle(bi);
  }

  private calcPhotoCoverage(photos: BannerPhoto[], containerDimensions: { height: number, width: number }) {
    photos.forEach(photo => {
      photo.widthCoverage = photo.width / containerDimensions.width;
      photo.heightCoverage = photo.width / containerDimensions.height;
    });
  }

  private smallestPhotoThatCoversTheContainer(photos: BannerPhoto[]) {
    return photos
      .filter(x => x.widthCoverage >= 1 && x.heightCoverage >= 1)
      .sort((a, b) => a.area - b.area)[0];
  }

  private photoThatStretchesTheLeast(photos: BannerPhoto[]) {
    return photos.sort((a, b) => b.area - a.area)[0];
  }

  private getContainerDimensions() {
    const scrollbarDimensions = this.scrollbarDimensionService.getDimensions();

    const containerHeight = this.containerElRef.nativeElement.clientHeight; // - scrollbarDimensions.height;
    const containerWidth = this.containerElRef.nativeElement.clientWidth - scrollbarDimensions.width;

    return { width: containerWidth, height: containerHeight };
  }

  private onError(result: Result) {
    this.error.emit(result);
    return EMPTY;
  }
}

export class BannerPhoto {
  area = 0;
  height = 0;
  heightCoverage = 0;
  location: string;
  width = 0;
  widthCoverage = 0;

  constructor(photo: PhotoContent) {
    this.location = photo.location;
    this.height = photo.height;
    this.width = photo.width;
    this.area = this.height * this.width;
  }
}
