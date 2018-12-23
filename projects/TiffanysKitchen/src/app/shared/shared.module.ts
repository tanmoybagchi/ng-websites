import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, MatListModule, MatMenuModule, MatToolbarModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { MhGeneralErrorModule } from 'mh-general-error';
import { MhGoogleSignInModule } from 'mh-google-sign-in';
import { MhInputSearchModule } from 'mh-input-search';
import { MhPageTitleModule } from 'mh-page-title';
import { MhThrobberModule } from 'mh-throbber';

@NgModule({
  imports: [],
  declarations: [],
  entryComponents: [],
  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    MhGeneralErrorModule,
    MhGoogleSignInModule,
    MhInputSearchModule,
    MhPageTitleModule,
    MhThrobberModule,
    RouterModule,
  ]
})
export class SharedModule {
  constructor() { }
}
