import { Component } from '@angular/core';
import { PageEditBase } from 'material-cms-admin';
import { AdminWines } from './admin-wines';
import { AdminWinesApprovalRules } from './admin-wines-approval-rules';

@Component({
  templateUrl: './admin-wines-edit.component.html'
})
export class AdminWinesEditComponent extends PageEditBase<AdminWines> {
  modelCreator = AdminWines;
  protected approvalRules = new AdminWinesApprovalRules();

  onEffectiveFromChange($event) {
    this.model.effectiveFrom = $event;
    this.saveStream.next();
  }
}
