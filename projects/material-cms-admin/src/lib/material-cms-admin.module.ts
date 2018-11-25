import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatCardModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressSpinnerModule, MatSliderModule, MatSlideToggleModule, MatSortModule, MatTableModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { MaterialCmsViewModule } from 'material-cms-view';
import { MaterialHelpersModule } from 'material-helpers';
import { AssetUploader, ASSET_UPLOADER } from './asset-uploader';
import { ChooseExternalLinkComponent } from './editor/choose-external-link.component';
import { ChooseInternalLinkComponent } from './editor/choose-internal-link.component';
import { EditorComponent } from './editor/editor.component';
import { AdminPageDatabase, ADMIN_PAGE_DATABASE } from './admin-page-database';
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
    MatDatepickerModule,
    MatDialogModule,
    MaterialCmsViewModule,
    MaterialHelpersModule,
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
  // tslint:disable-next-line:max-line-length
  static forRoot(adminPageDatabase: Type<AdminPageDatabase>, photoCompressor: Type<PhotoCompressor>, photoResizer: Type<PhotoResizer>, assetUploader: Type<AssetUploader>) {
    return <ModuleWithProviders<MaterialCmsAdminModule>>{
      ngModule: MaterialCmsAdminModule,
      providers: [
        { provide: ASSET_UPLOADER, useClass: assetUploader },
        { provide: ADMIN_PAGE_DATABASE, useClass: adminPageDatabase },
        { provide: PHOTO_COMPRESSOR, useClass: photoCompressor },
        { provide: PHOTO_RESIZER, useClass: photoResizer },
      ]
    };
  }
}
