import { ModuleWithProviders, NgModule } from '@angular/core';
import { ProviderConfig, PROVIDER_CONFIG } from './provider-config';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class MaterialCmsProvidersModule {
  static forRoot(providerConfig: ProviderConfig) {
    return <ModuleWithProviders<MaterialCmsProvidersModule>>{
      ngModule: MaterialCmsProvidersModule,
      providers: [
        { provide: PROVIDER_CONFIG, useValue: providerConfig },
      ]
    };
  }
}
