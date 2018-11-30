import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatButtonToggleModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatSortModule, MatTableModule, MatToolbarModule } from '@angular/material';
import { MaterialCmsAdminModule } from 'material-cms-admin';
import { CanvasPhotoCompressor, CanvasPhotoResizer, GDriveAssetUploader } from 'material-cms-providers';
import { MhGeneralErrorModule } from 'mh-general-error';
import { MhInputDateModule } from 'mh-input-date';
import { MhInputFileModule } from 'mh-input-file';
import { MhInputTextModule } from 'mh-input-text';
import { MhPageTitleModule } from 'mh-page-title';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminAnnouncementEditComponent } from './announcement/admin-announcement-edit.component';
import { AdminAnnouncementListComponent } from './announcement/admin-announcement-list.component';
import { AdminCallerEditComponent } from './caller/admin-caller-edit.component';
import { AdminCallerListComponent } from './caller/admin-caller-list.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminEventsComponent } from './events/admin-events.component';
import { AdminMinistriesEditComponent } from './ministries/admin-ministries-edit.component';
import { AdminSermonEditComponent } from './sermon/admin-sermon-edit.component';
import { AdminSermonListComponent } from './sermon/admin-sermon-list.component';

@NgModule({
  imports: [
    AdminRoutingModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MaterialCmsAdminModule.forRoot(CanvasPhotoCompressor, CanvasPhotoResizer, GDriveAssetUploader),
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MhGeneralErrorModule,
    MhInputDateModule,
    MhInputFileModule,
    MhInputTextModule,
    MhPageTitleModule,
  ],
  declarations: [
    AdminAnnouncementEditComponent,
    AdminAnnouncementListComponent,
    AdminCallerEditComponent,
    AdminCallerListComponent,
    AdminDashboardComponent,
    AdminEventsComponent,
    AdminMinistriesEditComponent,
    AdminSermonEditComponent,
    AdminSermonListComponent,
  ],
})
export class AdminModule { }
