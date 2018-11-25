import { NgModule } from '@angular/core';
import { HomepageModule } from '@app/homepage/homepage.module';
import { SharedModule } from '@app/shared/shared.module';
import { CanvasPhotoCompressor, CanvasPhotoResizer, MaterialCmsAdminModule } from 'material-cms-admin';
import { MaterialCmsViewModule } from 'material-cms-view';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminAnnouncementEditComponent } from './announcement/admin-announcement-edit.component';
import { AdminAnnouncementListComponent } from './announcement/admin-announcement-list.component';
import { AdminCallerEditComponent } from './caller/admin-caller-edit.component';
import { AdminCallerListComponent } from './caller/admin-caller-list.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminEventsComponent } from './events/admin-events.component';
import { GDriveAdminPageDatabase } from './gdrive-admin-page-database.service';
import { GDriveAssetUploader } from './gdrive-asset-uploader.service';
import { AdminMinistriesEditComponent } from './ministries/admin-ministries-edit.component';
import { AdminSermonEditComponent } from './sermon/admin-sermon-edit.component';
import { AdminSermonListComponent } from './sermon/admin-sermon-list.component';

@NgModule({
  imports: [
    AdminRoutingModule,
    SharedModule,
    HomepageModule,
    MaterialCmsViewModule,
    MaterialCmsAdminModule.forRoot(GDriveAdminPageDatabase, CanvasPhotoCompressor, CanvasPhotoResizer, GDriveAssetUploader),
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
