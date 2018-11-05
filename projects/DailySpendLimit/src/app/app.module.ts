import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CoreModule, LogLevel } from 'core';
import { GapiModule } from 'gapi';
import { environment } from '../environments/environment';
import { AppRootComponent } from './app-root/app-root.component';
import { AppRootModule } from './app-root/app-root.module';
import { routes } from './app-routes';
import { DashboardModule } from './dashboard/dashboard.module';
import { HomepageModule } from './homepage/homepage.module';
import { SecurityModule } from './security/security.module';
import { SetupModule } from './setup/setup.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    // The first two modules need to be BrowserAnimationsModule and SharedModule.
    BrowserAnimationsModule,
    SharedModule,
    AppRootModule,
    CoreModule.forRoot({ keyPrefix: 'DailySpendLimit' }, { logLevel: LogLevel.Warn }),
    DashboardModule,
    GapiModule,
    HomepageModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    SecurityModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    SetupModule,
  ],
  bootstrap: [AppRootComponent]
})
export class AppModule { }
