import { Component } from '@angular/core';
import { PageEditBase } from 'material-cms-admin';
import { AdminAnnouncement } from './admin-announcement';
import { AdminAnnouncementApprovalRules } from './admin-announcement-approval-rules';

@Component({
  templateUrl: './admin-announcement-edit.component.html'
})
export class AdminAnnouncementEditComponent extends PageEditBase<AdminAnnouncement> {
  modelCreator = AdminAnnouncement;
  protected approvalRules = new AdminAnnouncementApprovalRules();

  onEffectiveFromChange($event) {
    this.model.effectiveFrom = $event;
    this.saveStream.next();
  }

  onEffectiveToChange($event) {
    this.model.effectiveTo = $event;
    this.saveStream.next();
  }

  onTitleChange($event) {
    this.model.content.title = $event;
    this.saveStream.next();
  }

  onContentChange(content) {
    this.model.content.description = content;
    this.saveStream.next();
  }
}
