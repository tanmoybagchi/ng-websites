import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppRootComponent } from './app-root.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    AppFooterComponent,
    AppHeaderComponent,
    AppRootComponent,
  ],
  exports: [AppRootComponent]
})
export class AppRootModule { }
