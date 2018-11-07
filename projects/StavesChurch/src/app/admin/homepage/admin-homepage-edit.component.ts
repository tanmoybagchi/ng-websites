import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { PageEditBase } from '../page/page-edit-base';
import { AdminHomepage } from './admin-homepage';
import { AdminHomepageApprovalRules } from './admin-homepage-approval-rules';

@Component({
  templateUrl: './admin-homepage-edit.component.html',
  styleUrls: ['./admin-homepage-edit.component.scss']
})
export class AdminHomepageEditComponent extends PageEditBase<AdminHomepage> {
  choosingPhoto = false;
  modelCreator = AdminHomepage;
  protected approvalRules = new AdminHomepageApprovalRules();

  onTransparencyChange($event: MatSliderChange) {
    this.model.content.bannerPhotoTransparency = $event.value;
    this.saveStream.next();
  }

  onChangePhotoClick() {
    this.choosingPhoto = true;
  }

  onPhotoListDone(photoIdentifier: string) {
    this.choosingPhoto = false;
    this.model.content.bannerPhotoIdentifier = photoIdentifier;
    this.saveStream.next();
  }
}
