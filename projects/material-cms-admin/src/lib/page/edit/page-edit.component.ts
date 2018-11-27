import { Component } from '@angular/core';
import { Page } from 'material-cms-view';
import { PageApprovalRules } from './page-approval-rules';
import { PageEditBase } from './page-edit-base';

@Component({
  selector: 'cms-page-edit',
  templateUrl: './page-edit.component.html'
})
export class PageEditComponent extends PageEditBase<Page> {
  modelCreator = Page;
  protected approvalRules = new PageApprovalRules();

  onEffectiveFromChange(content) {
    this.model.effectiveFrom = content;
    this.saveStream.next();
  }

  onContentChange(content) {
    this.model.content = content;
    this.saveStream.next();
  }
}
