import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageEditComponent, PageListComponent, PhotoListComponent } from 'material-cms-admin';
import { AdminGuard } from '@app/security/admin.guard';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminEventsComponent } from './events/admin-events.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        canActivateChild: [AdminGuard],
        children: [
          { path: 'dashboard', component: AdminDashboardComponent },
          { path: 'events', component: AdminEventsComponent },
          { path: 'photos', component: PhotoListComponent },
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
