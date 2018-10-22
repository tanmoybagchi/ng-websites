import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
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
