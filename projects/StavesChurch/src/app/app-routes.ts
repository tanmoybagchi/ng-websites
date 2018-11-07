import { Routes } from '@angular/router';
import { HomepageComponent } from '@app/homepage/homepage.component';
import { MinistriesComponent } from '@app/ministries/ministries.component';
import { PageComponent } from '@app/page/page.component';
import { AdminGuard } from '@app/security/admin.guard';
import { SignInComponent } from '@app/security/sign-in.component';
import { ServerErrorComponent } from 'material-helpers';
import { AnnouncementsComponent } from './announcement/announcements/announcements.component';
import { CallerComponent } from './caller/caller.component';
import { EventsComponent } from './events/events/events.component';
import { PhotoGalleryComponent } from './photo/gallery/photo-gallery.component';
import { PhotoViewerComponent } from './photo/viewer/photo-viewer.component';
import { SermonComponent } from './sermon/sermon/sermon.component';

export const routes: Routes = [
  { path: 'admin', loadChildren: '@app/admin/admin.module#AdminModule', canLoad: [AdminGuard] },
  { path: 'announcements', component: AnnouncementsComponent },
  { path: 'caller', component: CallerComponent },
  { path: 'error', component: ServerErrorComponent },
  { path: 'events', component: EventsComponent },
  { path: 'ministries', component: MinistriesComponent },
  { path: 'ministries/:kind', component: MinistriesComponent },
  { path: 'photos', component: PhotoGalleryComponent },
  { path: 'photos/:identifier', component: PhotoViewerComponent },
  { path: 'sermons', component: SermonComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: ':kind', component: PageComponent },
  { path: '', component: HomepageComponent, pathMatch: 'full' },
];
