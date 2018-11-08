import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { ServiceAccount } from './auth/service-account';

@NgModule({
  imports: [],
  declarations: [],
  exports: []
})
export class GapiModule {
  constructor(@Optional() @SkipSelf() parentModule: GapiModule) {
    if (parentModule) {
      throw new Error('GapiModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(serviceAccount: ServiceAccount) {
    return <ModuleWithProviders>{
      ngModule: GapiModule,
      providers: [
        { provide: ServiceAccount, useValue: serviceAccount }
      ]
    };
  }
}
