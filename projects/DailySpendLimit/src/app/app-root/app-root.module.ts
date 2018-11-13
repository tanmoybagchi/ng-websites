import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { AppRootComponent } from './app-root.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    AppRootComponent,
  ],
  exports: [AppRootComponent]
})
export class AppRootModule { }
