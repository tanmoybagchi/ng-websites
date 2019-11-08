import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MhGeneralErrorModule } from 'mh-general-error';
import { MhInputTextModule } from 'mh-input-text';
import { MhPageTitleModule } from 'mh-page-title';
import { MhServerErrorModule } from 'mh-server-error';

@NgModule({
  imports: [],
  declarations: [],
  entryComponents: [],
  exports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MhGeneralErrorModule,
    MhInputTextModule,
    MhPageTitleModule,
    MhServerErrorModule,
    RouterModule,
  ]
})
export class SharedModule {
  constructor() { }
}
