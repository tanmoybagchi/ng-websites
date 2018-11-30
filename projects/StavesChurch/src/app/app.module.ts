import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { routes } from '@app/app-routes';
import { environment as env } from '@env/environment';
import { CoreModule, LogLevel } from 'core';
import { GapiModule } from 'gapi';
import { GDrivePageDatabase, MaterialCmsProvidersModule } from 'material-cms-providers';
import { MaterialCmsViewModule } from 'material-cms-view';
import { AnnouncementModule } from './announcement/announcement.module';
import { AppRootComponent } from './app-root/app-root.component';
import { AppRootModule } from './app-root/app-root.module';
import { CallerModule } from './caller/caller.module';
import { EventsModule } from './events/events.module';
import { HomepageModule } from './homepage/homepage.module';
import { MinistriesModule } from './ministries/ministries.module';
import { SecurityModule } from './security/security.module';
import { SermonModule } from './sermon/sermon.module';
import { MySitePages } from './shared/my-site-pages';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    // The first two modules need to be BrowserAnimationsModule and SharedModule.
    BrowserAnimationsModule,
    SharedModule,
    AnnouncementModule,
    AppRootModule,
    CallerModule,
    CoreModule.forRoot({ keyPrefix: 'StavesChurch' }, { logLevel: LogLevel.Warn }),
    EventsModule,
    GapiModule.forRoot({ id: env.g_serviceaccount_id, password: env.g_serviceaccount_key, scope: env.g_serviceaccount_scope }),
    HomepageModule,
    // MaterialCmsProvidersModule MUST come before MaterialCmsViewModule.
    MaterialCmsProvidersModule.forRoot({
      audioFolder: env.audioFolder,
      docFolder: env.docFolder,
      g_drive_database: env.database,
      g_oauth_login_name: env.g_oauth_login_name,
      photoFolder: env.photoFolder,
    }),
    MaterialCmsViewModule.forRoot(MySitePages, GDrivePageDatabase),
    MinistriesModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    SecurityModule,
    SermonModule,
  ],
  bootstrap: [AppRootComponent]
})
export class AppModule { }
