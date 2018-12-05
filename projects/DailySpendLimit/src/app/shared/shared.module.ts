import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatToolbarModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { MhGeneralErrorModule } from 'mh-general-error';
import { MhGoogleSignInModule } from 'mh-google-sign-in';
import { MhInputDateModule } from 'mh-input-date';
import { MhInputEmailModule } from 'mh-input-email';
import { MhInputUsdModule } from 'mh-input-usd';
import { MhPageTitleModule } from 'mh-page-title';
import { MhServerErrorModule } from 'mh-server-error';
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
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    MhGeneralErrorModule,
    MhGoogleSignInModule,
    MhInputDateModule,
    MhInputEmailModule,
    MhInputUsdModule,
    MhPageTitleModule,
    MhServerErrorModule,
    MhThrobberModule,
    RouterModule,
  ]
})
export class SharedModule {
  constructor() { }
}
