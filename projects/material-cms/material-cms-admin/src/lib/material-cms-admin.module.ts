import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatListModule, MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule, MatSliderModule, MatSlideToggleModule, MatSortModule, MatTableModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { MaterialCmsViewModule } from 'material-cms-view';
import { MhGeneralErrorModule } from 'mh-general-error';
import { MhInputDateModule } from 'mh-input-date';
import { MhInputFileModule } from 'mh-input-file';
import { MhInputTextModule } from 'mh-input-text';
import { MhPageTitleModule } from 'mh-page-title';
import { AssetUploader, ASSET_UPLOADER } from './asset-uploader';
import { ChooseExternalLinkComponent } from './editor/choose-external-link.component';
import { ChooseInternalLinkComponent } from './editor/choose-internal-link.component';
import { EditorComponent } from './editor/editor.component';
import { PageCommandButtonsComponent } from './page/command-buttons/page-command-buttons.component';
import { PageEditComponent } from './page/edit/page-edit.component';
import { PageListComponent } from './page/list/page-list.component';
import { PageStatusComponent } from './page/status/page-status.component';
import { PhotoListComponent } from './photo/list/photo-list.component';
import { PhotoCompressor, PHOTO_COMPRESSOR } from './photo/upload/photo-compressor';
import { PhotoResizer, PHOTO_RESIZER } from './photo/upload/photo-resizer';
import { PhotoUploadComponent } from './photo/upload/photo-upload.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MaterialCmsViewModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    MhGeneralErrorModule,
    MhInputDateModule,
    MhInputFileModule,
    MhInputTextModule,
    MhPageTitleModule,
  ],
  declarations: [
    ChooseExternalLinkComponent,
    ChooseInternalLinkComponent,
    EditorComponent,
    PageCommandButtonsComponent,
    PageEditComponent,
    PageListComponent,
    PageStatusComponent,
    PhotoListComponent,
    PhotoUploadComponent,
  ],
  exports: [
    ChooseExternalLinkComponent,
    ChooseInternalLinkComponent,
    EditorComponent,
    PageCommandButtonsComponent,
    PageEditComponent,
    PageListComponent,
    PageStatusComponent,
    PhotoListComponent,
    PhotoUploadComponent,
  ]
})
export class MaterialCmsAdminModule {
  static forRoot(photoCompressor: Type<PhotoCompressor>, photoResizer: Type<PhotoResizer>, assetUploader: Type<AssetUploader>) {
    return <ModuleWithProviders<MaterialCmsAdminModule>>{
      ngModule: MaterialCmsAdminModule,
      providers: [
        { provide: ASSET_UPLOADER, useClass: assetUploader },
        { provide: PHOTO_COMPRESSOR, useClass: photoCompressor },
        { provide: PHOTO_RESIZER, useClass: photoResizer },
      ]
    };
  }
}
