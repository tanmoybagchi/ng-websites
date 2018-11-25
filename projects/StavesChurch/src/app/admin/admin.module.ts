import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatButtonToggleModule, MatCardModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatSortModule, MatTableModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { HomepageModule } from '@app/homepage/homepage.module';
import { CanvasPhotoCompressor, CanvasPhotoResizer, MaterialCmsAdminModule } from 'material-cms-admin';
import { MaterialCmsViewModule } from 'material-cms-view';
import { MaterialHelpersModule } from 'material-helpers';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminAnnouncementEditComponent } from './announcement/admin-announcement-edit.component';
import { AdminAnnouncementListComponent } from './announcement/admin-announcement-list.component';
import { AdminCallerEditComponent } from './caller/admin-caller-edit.component';
import { AdminCallerListComponent } from './caller/admin-caller-list.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminEventsComponent } from './events/admin-events.component';
import { GDriveAssetUploader } from './gdrive-asset-uploader.service';
import { AdminMinistriesEditComponent } from './ministries/admin-ministries-edit.component';
import { AdminSermonEditComponent } from './sermon/admin-sermon-edit.component';
import { AdminSermonListComponent } from './sermon/admin-sermon-list.component';

@NgModule({
  imports: [
    AdminRoutingModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HomepageModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MaterialCmsAdminModule.forRoot(CanvasPhotoCompressor, CanvasPhotoResizer, GDriveAssetUploader),
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
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
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
