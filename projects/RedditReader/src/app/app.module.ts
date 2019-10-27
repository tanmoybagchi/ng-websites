import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CoreModule, LogLevel } from 'core';
import { AppRootComponent } from './app-root/app-root.component';
import { AppRootModule } from './app-root/app-root.module';
import { routes } from './app-routes';
import { DomainModule } from './domain/domain.module';
import { HomepageModule } from './homepage/homepage.module';
import { SharedModule } from './shared/shared.module';
import { ListingModule } from './listing/listing.module';

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
    HomepageModule,
    DomainModule,
    ListingModule,
  ],
  bootstrap: [AppRootComponent]
})
export class AppModule { }
