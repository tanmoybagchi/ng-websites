import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injector, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { Http400404Interceptor } from './http-400-404-interceptor.service';
import { Http500Interceptor } from './http-500-interceptor.service';
import { ConsoleLoggerService } from './logger/console-logger.service';
import { LoggerConfig } from './logger/logger-config';
import { LoggerService } from './logger/logger.service';
import { Http401403Interceptor } from './security/http-401-403-interceptor.service';
import { StorageConfig } from './storage/storage-config';

@NgModule({
  imports: [
    HttpClientModule
  ],
  declarations: [],
  entryComponents: [],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Http400404Interceptor, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: Http401403Interceptor, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: Http500Interceptor, multi: true, },
    { provide: LoggerService, useClass: ConsoleLoggerService },
  ]
})
export class CoreModule {
  static injector: Injector = null;

  static forRoot(storageConfig: StorageConfig, loggerConfig: LoggerConfig): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: StorageConfig, useValue: storageConfig },
        { provide: LoggerConfig, useValue: loggerConfig }
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule, injector: Injector) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }

    CoreModule.injector = injector;
  }
}
