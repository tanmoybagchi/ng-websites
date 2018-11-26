import { NgModule } from '@angular/core';
import { MhInputEmailComponent } from './mh-input-email.component';
import { InputEmailComponent } from './input-email.component';

@NgModule({
  declarations: [MhInputEmailComponent, InputEmailComponent],
  imports: [
  ],
  exports: [MhInputEmailComponent]
})
export class MhInputEmailModule { }
