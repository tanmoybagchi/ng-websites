import { Component } from '@angular/core';
import { PageEditBase } from 'material-cms-admin';
import { AdminAboutUsApprovalRules } from './about-us-approval-rules';
import { AdminAboutUs } from './admin-about-us';

@Component({
  templateUrl: './admin-about-us-edit.component.html'
})
export class AdminAboutUsEditComponent extends PageEditBase<AdminAboutUs> {
  modelCreator = AdminAboutUs;
  protected approvalRules = new AdminAboutUsApprovalRules();

  onEffectiveFromChange($event) {
    this.model.effectiveFrom = $event;
    this.saveStream.next();
  }

  onItemChange(item, key: string, newValue) {
    item[key] = newValue;
    this.saveStream.next();
  }
}
