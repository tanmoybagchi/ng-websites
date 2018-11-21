import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatCardModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressSpinnerModule, MatSliderModule, MatSlideToggleModule, MatSortModule, MatTableModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { AssetUploader, ASSET_UPLOADER } from './asset-uploader';
import { ChooseExternalLinkComponent } from './editor/choose-external-link.component';
import { ChooseInternalLinkComponent } from './editor/choose-internal-link.component';
import { EditorComponent } from './editor/editor.component';
import { PageDatabase, PAGE_DATABASE } from './page-database';
import { PageCommandButtonsComponent } from './page/command-buttons/page-command-buttons.component';
import { PageEditComponent } from './page/edit/page-edit.component';
import { PageListComponent } from './page/list/page-list.component';
import { PageStatusComponent } from './page/status/page-status.component';
import { PageViewComponent } from './page/view/page-view.component';
import { PhotoGalleryComponent } from './photo/gallery/photo-gallery.component';
import { PhotoListComponent } from './photo/list/photo-list.component';
import { PhotoProcessor, PHOTO_PROCESSOR } from './photo/upload/photo-processor';
import { PhotoUploadComponent } from './photo/upload/photo-upload.component';
import { PhotoViewerComponent } from './photo/viewer/photo-viewer.component';
import { SitePages, SITE_PAGES } from './site-pages';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  declarations: [
    ChooseExternalLinkComponent,
    ChooseInternalLinkComponent,
    EditorComponent,
    PageCommandButtonsComponent,
    PageEditComponent,
    PageListComponent,
    PageStatusComponent,
    PageViewComponent,
    PhotoGalleryComponent,
    PhotoListComponent,
    PhotoUploadComponent,
    PhotoViewerComponent,
  ],
  exports: [
    ChooseExternalLinkComponent,
    ChooseInternalLinkComponent,
    EditorComponent,
    PageCommandButtonsComponent,
    PageEditComponent,
    PageListComponent,
    PageStatusComponent,
    PageViewComponent,
    PhotoGalleryComponent,
    PhotoListComponent,
    PhotoUploadComponent,
    PhotoViewerComponent,
  ]
})
export class MaterialCmsModule {
  constructor(@Optional() @SkipSelf() parentModule: MaterialCmsModule) {
    if (parentModule) {
      throw new Error('MaterialCmsModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(sitePages: SitePages, pageDatabase: PageDatabase, photoProcessor: PhotoProcessor, assetUploader: AssetUploader) {
    return <ModuleWithProviders<MaterialCmsModule>>{
      ngModule: MaterialCmsModule,
      providers: [
        { provide: ASSET_UPLOADER, useClass: assetUploader },
        { provide: PAGE_DATABASE, useClass: pageDatabase },
        { provide: PHOTO_PROCESSOR, useClass: photoProcessor },
        { provide: SITE_PAGES, useValue: sitePages },
      ]
    };
  }
}
