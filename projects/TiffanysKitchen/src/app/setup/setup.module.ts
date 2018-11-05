import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FilesComponent } from './files/files.component';
import { SheetComponent } from './sheet/sheet.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [FilesComponent, SheetComponent]
})
export class SetupModule { }
