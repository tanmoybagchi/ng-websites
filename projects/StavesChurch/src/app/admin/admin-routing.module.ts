import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@app/security/admin.guard';
import { PageEditComponent, PageListComponent, PhotoListComponent } from 'material-cms-admin';
import { AdminAnnouncementEditComponent } from './announcement/admin-announcement-edit.component';
import { AdminAnnouncementListComponent } from './announcement/admin-announcement-list.component';
import { AdminNewsletterEditComponent } from './newsletter/admin-newsletter-edit.component';
import { AdminNewsletterListComponent } from './newsletter/admin-newsletter-list.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminEventsComponent } from './events/admin-events.component';
import { AdminMinistriesEditComponent } from './ministries/admin-ministries-edit.component';
import { AdminSermonEditComponent } from './sermon/admin-sermon-edit.component';
import { AdminSermonListComponent } from './sermon/admin-sermon-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        canActivateChild: [AdminGuard],
        children: [
          { path: 'announcement', component: AdminAnnouncementListComponent },
          { path: 'announcement/:id', component: AdminAnnouncementEditComponent },
          { path: 'caller', component: AdminNewsletterListComponent },
          { path: 'caller/:id', component: AdminNewsletterEditComponent },
          { path: 'dashboard', component: AdminDashboardComponent },
          { path: 'events', component: AdminEventsComponent },
          { path: 'ministries/:id', component: AdminMinistriesEditComponent },
          { path: 'photos', component: PhotoListComponent },
          { path: 'sermon', component: AdminSermonListComponent },
          { path: 'sermon/:id', component: AdminSermonEditComponent },
          { path: ':kind', component: PageListComponent },
          { path: ':kind/:id', component: PageEditComponent },
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
