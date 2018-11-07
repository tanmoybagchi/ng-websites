import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PhotoGalleryComponent } from './gallery/photo-gallery.component';
import { PhotoViewerComponent } from './viewer/photo-viewer.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    PhotoGalleryComponent,
    PhotoViewerComponent,
  ]
})
export class PhotoModule { }
