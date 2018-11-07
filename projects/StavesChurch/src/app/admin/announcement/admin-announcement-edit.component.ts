import { Component } from '@angular/core';
import { PageEditBase } from '@app/admin/page/page-edit-base';
import { AdminAnnouncement } from './admin-announcement';
import { AdminAnnouncementApprovalRules } from './admin-announcement-approval-rules';

@Component({
  templateUrl: './admin-announcement-edit.component.html'
})
export class AdminAnnouncementEditComponent extends PageEditBase<AdminAnnouncement> {
  modelCreator = AdminAnnouncement;
  protected approvalRules = new AdminAnnouncementApprovalRules();

  onContentChange(content) {
    this.model.content.description = content;
    this.saveStream.next();
  }
}
