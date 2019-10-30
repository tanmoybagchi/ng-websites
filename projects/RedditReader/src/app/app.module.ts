import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CoreModule, LogLevel } from 'core';
import { AppRootComponent } from './app-root/app-root.component';
import { AppRootModule } from './app-root/app-root.module';
import { routes } from './app-routes';
import { DomainModule } from './domain/domain.module';
import { SharedModule } from './shared/shared.module';
import { ListingModule } from './listing/listing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
  ],
  imports: [
    // The first two modules need to be BrowserAnimationsModule and SharedModule.
    BrowserAnimationsModule,
    SharedModule,
    AppRootModule,
    CoreModule.forRoot({ keyPrefix: 'RedditReader' }, { logLevel: LogLevel.Warn }),
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'disabled' }),
    DomainModule,
    ListingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  bootstrap: [AppRootComponent]
})
export class AppModule { }
