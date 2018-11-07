import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoQuery } from '@app/photo/photo-query.service';
import { EventManagerService, Result, ScrollbarDimensionService } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Photo } from '../photo';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss']
})
export class PhotoGalleryComponent implements OnInit {
  @ViewChild('photos') private photosElRef: ElementRef;

  errors: any;

  private photos: Photo[];
  private readonly gapBetweenPhotos = 6;
  private resizeStream = new Subject<number>();
  public addingNew = false;
  public dataSource = [];

  constructor(
    private eventManagerService: EventManagerService,
    private photoQuery: PhotoQuery,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private scrollbarDimensionService: ScrollbarDimensionService,
  ) { }

  ngOnInit() {
    this.resizeStream.pipe(
      // wait 50ms after each resize
      debounceTime(50),

      // ignore new size if same as previous size
      distinctUntilChanged(),
    ).subscribe(containerWidth => {
      const list = this.sort_and_filter_photos();

      this.arrange_photos_in_rows(list, containerWidth);
    });

    this.getPhotos();
  }

  private getPhotos() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.photoQuery.execute().pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.onListQuery(_));
  }

  onResize(event) {
    this.resizeStream.next(this.getContainerWidth());
  }

  onListQuery(photos: Photo[]) {
    this.photos = photos;

    const containerWidth = this.getContainerWidth();
    const list = this.sort_and_filter_photos();
    this.arrange_photos_in_rows(list, containerWidth);
  }

  private sort_and_filter_photos() {
    const list = this.photos.map(x => new PhotoListItem(x, this.sanitizer));

    list.sort((a, b) => b.savedOn.valueOf() - a.savedOn.valueOf());

    return list;
  }

  private arrange_photos_in_rows(list: PhotoListItem[], containerWidth: number) {
    // We want to arrange the photos in neat little rectangles.
    // We also want to avoid re-sizing the photos as that will distort it.
    // So we will create a "viewport" showing the middle portion of the photo.

    this.dataSource = [];

    // To avoid re-sizing the photos, we set our viewport's height to the shortest photo
    const viewportHeight = Math.min.apply(null, list.map(photo => photo.height));
    // and set our viewport's height to the narrowest photo.
    let viewportWidth = Math.min.apply(null, list.map(photo => photo.width));

    // We will have a small gap between the photos; so we need to account for that.
    let viewportAndMargin = viewportWidth + this.gapBetweenPhotos;

    // How many photos can we fit into a row?
    const photoColCount = Math.floor(containerWidth / viewportAndMargin);

    // We want the photos to take up the entire row and not leave an ugly gap at the end.
    // So we will stretch the photos slightly.
    viewportAndMargin = (containerWidth / photoColCount);
    viewportWidth = viewportAndMargin - this.gapBetweenPhotos;

    // Now we start creating the rows of photos.
    while (list.length) {
      // Create a row.
      const photoRow = list.splice(0, photoColCount);

      for (let index = 0; index < photoRow.length; index++) {
        const photo = photoRow[index];

        // Set the viewport's height
        photo.viewportHeight = viewportHeight;
        // and move the photo up to vertically center it (photo.top <= 0).
        photo.top = (photo.viewportHeight - photo.height) / 2;

        // Set the viewport's width.
        // The photo on the right edge of the container won't have a right margin keeping in mind
        // that this photo may not be the last photo of the row (the last row may not be full).
        if (index < photoColCount - 1) {
          photo.viewportWidth = viewportWidth;
          photo.viewportRightMargin = this.gapBetweenPhotos;
        } else {
          photo.viewportWidth = viewportAndMargin;
        }

        if (photo.width < photo.viewportWidth) {
          // If the photo is slimmer than the viewport, stretch the photo to fit the viewport.
          photo.width = photo.viewportWidth;
        } else {
          // If the photo is wider than the viewport, move the photo left to horizontally center it (photo.left <= 0).
          photo.left = (photo.viewportWidth - photo.width) / 2;
        }
      }

      this.dataSource.push(photoRow);
    }
  }

  private getContainerWidth() {
    // Find out the width of the scroll bar
    const scrollbarDimensions = this.scrollbarDimensionService.getDimensions();
    // and subtract it from the container width.
    const containerWidth = this.photosElRef.nativeElement.clientWidth - scrollbarDimensions.width;

    return containerWidth;
  }

  onPhotoClick($event: PhotoListItem) {
    this.router.navigate(['.', $event.identifier], { relativeTo: this.route });
  }

  onOKClick() {
    window.history.back();
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}

export class PhotoListItem {
  altText = '';
  savedOn: Date;
  height = 0;
  id = 0;
  identifier = '';
  left = 0;
  name = '';
  selected = false;
  top = 0;
  url: SafeStyle;
  viewportHeight = 0;
  viewportRightMargin = 0;
  viewportWidth = 0;
  width = 0;

  constructor(model: Photo, sanitizer: DomSanitizer) {
    this.savedOn = model.effectiveFrom;
    this.identifier = model.identifier;
    this.height = model.smallThumbnail.height;
    this.width = model.smallThumbnail.width;

    if (model.smallThumbnail) {
      this.name = model.smallThumbnail.name;
      this.url = sanitizer.bypassSecurityTrustStyle(`url(${model.smallThumbnail.location})`);
    }
  }
}
