import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Result } from 'core';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Photo } from '../photo';
import { PhotoQuery } from '@app/photo/photo-query.service';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.scss']
})
export class PhotoViewerComponent implements OnInit {
  private currentPhotoIndex: number;
  errors: any;
  identifier: string;
  private photos: Photo[];
  @ViewChild('photo') private photoElRef: ElementRef;

  constructor(
    private photoCurrentQuery: PhotoQuery,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => this.onParams(params));
  }

  onSwipeLeft() {
    this.currentPhotoIndex++;

    if (this.currentPhotoIndex === this.photos.length) {
      this.currentPhotoIndex = 0;
    }

    this.router.navigate(['..', this.photos[this.currentPhotoIndex].identifier], { relativeTo: this.route, replaceUrl: true });
  }

  onSwipeRight() {
    this.currentPhotoIndex--;

    if (this.currentPhotoIndex === -1) {
      this.currentPhotoIndex = this.photos.length - 1;
    }

    this.router.navigate(['..', this.photos[this.currentPhotoIndex].identifier], { relativeTo: this.route, replaceUrl: true });
  }

  private onParams(params: ParamMap) {
    this.identifier = params.get('identifier');

    this.getPhotos();
  }

  private getPhotos() {
    this.photoCurrentQuery.execute().pipe(
      catchError(err => this.onError(err))
    ).subscribe(_ => this.onListQuery(_));
  }

  private onListQuery(photos: Photo[]) {
    this.photos = photos;

    const currentPhoto = photos.filter(p => p.identifier === this.identifier)[0];
    this.currentPhotoIndex = photos.indexOf(currentPhoto);

    const photoSizes = currentPhoto.photos();

    const widestDimension = Math.max(...photoSizes.map(x => x.width));
    const widestPhoto = currentPhoto.photos().find(x => x.width === widestDimension);

    const imgEl = this.photoElRef.nativeElement as HTMLImageElement;
    imgEl.src = widestPhoto.location;

    imgEl.srcset = photoSizes.map(x => `${x.location} ${x.width}w`).join(',');

    imgEl.sizes = '100vw';
  }

  private onError(result: Result) {
    this.errors = result.errors;
    return EMPTY;
  }
}
