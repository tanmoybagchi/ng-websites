import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatCardModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatProgressSpinnerModule, MatToolbarModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { MaterialHelpersModule } from 'material-helpers';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MaterialHelpersModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
  ],
  declarations: [],
  entryComponents: [],
  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MaterialHelpersModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    RouterModule,
  ]
})
export class SharedModule {
  constructor() { }
}
