import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatListModule, MatProgressSpinnerModule, MatSelectModule, MatToolbarModule } from '@angular/material';
import { BytesPipe } from './bytes.pipe';
import { GeneralErrorComponent } from './general-error/general-error.component';
import { GoogleSignInComponent } from './google-sign-in/google-sign-in.component';
import { InputDateComponent } from './input-date/input-date.component';
import { InputIntegerComponent } from './input-integer/input-integer.component';
import { InputSearchComponent } from './input-search/input-search.component';
import { InputSelectComponent } from './input-select/input-select.component';
import { InputTextComponent } from './input-text/input-text.component';
import { InputUSDComponent } from './input-usd/input-usd.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { ThrobberComponent } from './throbber/throbber.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatToolbarModule,
  ],
  declarations: [
    BytesPipe,
    GeneralErrorComponent,
    GoogleSignInComponent,
    InputDateComponent,
    InputIntegerComponent,
    InputSearchComponent,
    InputSelectComponent,
    InputTextComponent,
    InputUSDComponent,
    PageTitleComponent,
    ServerErrorComponent,
    ThrobberComponent,
  ],
  entryComponents: [],
  exports: [
    BytesPipe,
    GeneralErrorComponent,
    GoogleSignInComponent,
    InputDateComponent,
    InputIntegerComponent,
    InputSearchComponent,
    InputSelectComponent,
    InputTextComponent,
    InputUSDComponent,
    PageTitleComponent,
    ServerErrorComponent,
    ThrobberComponent,
  ]
})
export class MaterialHelpersModule { }
