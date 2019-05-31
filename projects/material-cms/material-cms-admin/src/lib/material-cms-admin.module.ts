import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
