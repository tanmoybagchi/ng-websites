import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatToolbarModule } from '@angular/material';
import { ServerErrorComponent } from './server-error.component';

@NgModule({
  declarations: [
    ServerErrorComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
  ],
  exports: [
    ServerErrorComponent
  ]
})
export class MhServerErrorModule { }
