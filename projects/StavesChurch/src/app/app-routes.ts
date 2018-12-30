import { Routes } from '@angular/router';
import { HomepageComponent } from '@app/homepage/homepage.component';
import { MinistriesComponent } from '@app/ministries/ministries.component';
import { AdminGuard } from '@app/security/admin.guard';
import { PageViewComponent, PhotoGalleryComponent, PhotoViewerComponent } from 'material-cms-view';
import { ServerErrorComponent } from 'mh-server-error';
import { AnnouncementDetailComponent } from './announcement/detail/announcement-detail.component';
import { EventDetailComponent } from './events/detail/event-detail.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { SignInComponent } from './security/sign-in.component';
import { SermonDetailComponent } from './sermon/detail/sermon-detail.component';

export const routes: Routes = [
  { path: 'admin', loadChildren: '@app/admin/admin.module#AdminModule', canLoad: [AdminGuard] },
  { path: 'announcements', component: AnnouncementDetailComponent },
  { path: 'error', component: ServerErrorComponent },
  { path: 'events', component: EventDetailComponent },
  { path: 'ministries', component: MinistriesComponent },
  { path: 'ministries/:kind', component: MinistriesComponent },
  { path: 'newsletter', component: NewsletterComponent },
  { path: 'photos', component: PhotoGalleryComponent },
  { path: 'photos/:id', component: PhotoViewerComponent },
  { path: 'sermons', component: SermonDetailComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: ':kind', component: PageViewComponent },
  { path: '', component: HomepageComponent, pathMatch: 'full' },
];
