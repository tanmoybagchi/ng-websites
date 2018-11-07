import { NgModule } from '@angular/core';
import { HomepageModule } from '@app/homepage/homepage.module';
import { SharedModule } from '@app/shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminAnnouncementEditComponent } from './announcement/admin-announcement-edit.component';
import { AdminAnnouncementListComponent } from './announcement/admin-announcement-list.component';
import { AdminCallerEditComponent } from './caller/admin-caller-edit.component';
import { AdminCallerListComponent } from './caller/admin-caller-list.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { ChooseExternalLinkComponent } from './editor/choose-external-link.component';
import { ChooseInternalLinkComponent } from './editor/choose-internal-link.component';
import { EditorComponent } from './editor/editor.component';
import { AdminEventsComponent } from './events/admin-events.component';
import { AdminHomepageEditComponent } from './homepage/admin-homepage-edit.component';
import { AdminHomepageListComponent } from './homepage/admin-homepage-list.component';
import { AdminMinistriesEditComponent } from './ministries/admin-ministries-edit.component';
import { PageCommandButtonsComponent } from './page/command-buttons/page-command-buttons.component';
import { PageEditComponent } from './page/page-edit/page-edit.component';
import { PageListComponent } from './page/page-list/page-list.component';
import { PageStatusComponent } from './page/status/page-status.component';
import { AdminPhotoListComponent } from './photo/admin-photo-list.component';
import { AdminPhotoUploadComponent } from './photo/admin-photo-upload.component';
import { AdminSermonEditComponent } from './sermon/admin-sermon-edit.component';
import { AdminSermonListComponent } from './sermon/admin-sermon-list.component';

@NgModule({
  imports: [
    AdminRoutingModule,
    SharedModule,
    HomepageModule,
  ],
  declarations: [
    AdminAnnouncementEditComponent,
    AdminAnnouncementListComponent,
    AdminCallerEditComponent,
    AdminCallerListComponent,
    AdminDashboardComponent,
    AdminEventsComponent,
    AdminHomepageEditComponent,
    AdminHomepageListComponent,
    AdminMinistriesEditComponent,
    AdminPhotoListComponent,
    AdminPhotoUploadComponent,
    AdminSermonEditComponent,
    AdminSermonListComponent,
    ChooseExternalLinkComponent,
    ChooseInternalLinkComponent,
    EditorComponent,
    PageCommandButtonsComponent,
    PageEditComponent,
    PageListComponent,
    PageStatusComponent,
  ],
})
export class AdminModule { }
