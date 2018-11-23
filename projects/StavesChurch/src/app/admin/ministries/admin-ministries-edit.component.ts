import { Component } from '@angular/core';
import { Ministry } from '@app/ministries/ministries';
import { PageEditBase } from 'material-cms';
import { AdminMinistries } from './admin-ministries';
import { AdminMinistriesApprovalRules } from './admin-ministries-approval-rules';

@Component({
  templateUrl: './admin-ministries-edit.component.html'
})
export class AdminMinistriesEditComponent extends PageEditBase<AdminMinistries> {
  modelCreator = AdminMinistries;
  protected approvalRules = new AdminMinistriesApprovalRules();

  onEffectiveFromChange($event) {
    this.model.effectiveFrom = $event;
    this.saveStream.next();
  }

  onHeaderChange(content) {
    this.model.content.header = content;
    this.saveStream.next();
  }

  onMinistryNameChange(item: Ministry, $event) {
    item.name = $event;
    this.saveStream.next();
  }

  onMinistryPurposeChange(item: Ministry, $event) {
    item.purpose = $event;
    this.saveStream.next();
  }

  addAfter(item: Ministry) {
    this.model.addAfter(item);
    this.saveStream.next();
  }

  remove(item: Ministry) {
    this.model.remove(item);
    this.saveStream.next();
  }

  moveUp(item: Ministry) {
    this.model.moveUp(item);
    this.saveStream.next();
  }

  moveDown(item: Ministry) {
    this.model.moveDown(item);
    this.saveStream.next();
  }
}
