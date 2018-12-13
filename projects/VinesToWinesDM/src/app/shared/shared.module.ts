import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule, MatListModule, MatMenuModule, MatProgressSpinnerModule, MatToolbarModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { MhGeneralErrorModule } from 'mh-general-error';
import { MhGoogleSignInModule } from 'mh-google-sign-in';
import { MhPageTitleModule } from 'mh-page-title';
import { MhServerErrorModule } from 'mh-server-error';
import { MhThrobberModule } from 'mh-throbber';

@NgModule({
  imports: [
  ],
  declarations: [  ],
  entryComponents: [],
  exports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MhGeneralErrorModule,
    MhGoogleSignInModule,
    MhPageTitleModule,
    MhServerErrorModule,
    MhThrobberModule,
    RouterModule,
  ]
})
export class SharedModule {
  constructor() { }
}
