import { Routes } from '@angular/router';
import { HomepageComponent } from '@app/homepage/homepage.component';
import { PageComponent } from '@app/page/page.component';
import { AdminGuard } from '@app/security/admin.guard';
import { ServerErrorComponent } from 'material-helpers';
import { AboutUsDetailComponent } from './about-us/about-us-detail.component';
import { EventsDetailComponent } from './events/events-detail/events-detail.component';
import { PhotoGalleryComponent } from './photo/gallery/photo-gallery.component';
import { PhotoViewerComponent } from './photo/viewer/photo-viewer.component';
import { SignInComponent } from './security/sign-in.component';

export const routes: Routes = [
  { path: 'about-us', component: AboutUsDetailComponent },
  { path: 'admin', loadChildren: '@app/admin/admin.module#AdminModule', canLoad: [AdminGuard] },
  { path: 'error', component: ServerErrorComponent },
  { path: 'events', component: EventsDetailComponent },
  { path: 'photos', component: PhotoGalleryComponent },
  { path: 'photos/:identifier', component: PhotoViewerComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: ':kind', component: PageComponent },
  { path: '', component: HomepageComponent, pathMatch: 'full' },
];
