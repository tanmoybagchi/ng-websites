import { NgModule } from '@angular/core';
import { HomepageModule } from '@app/homepage/homepage.module';
import { SharedModule } from '@app/shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { ChooseExternalLinkComponent } from './editor/choose-external-link.component';
import { ChooseInternalLinkComponent } from './editor/choose-internal-link.component';
import { EditorComponent } from './editor/editor.component';
import { PageCommandButtonsComponent } from './page/command-buttons/page-command-buttons.component';
import { PageEditComponent } from './page/page-edit/page-edit.component';
import { PageListComponent } from './page/page-list/page-list.component';
import { PageStatusComponent } from './page/status/page-status.component';
import { AdminPhotoListComponent } from './photo/admin-photo-list.component';
import { AdminPhotoUploadComponent } from './photo/admin-photo-upload.component';

@NgModule({
  imports: [
    AdminRoutingModule,
    SharedModule,
    HomepageModule,
  ],
  declarations: [
    AdminDashboardComponent,
    AdminPhotoListComponent,
    AdminPhotoUploadComponent,
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
