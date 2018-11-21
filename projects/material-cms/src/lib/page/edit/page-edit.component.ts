import { Component } from '@angular/core';
import { Page } from '../../page';
import { PageApprovalRules } from './page-approval-rules';
import { PageEditBase } from './page-edit-base';

@Component({
  selector: 'cms-page-edit',
  templateUrl: './page-edit.component.html'
})
export class PageEditComponent extends PageEditBase<Page> {
  modelCreator = Page;
  protected approvalRules = new PageApprovalRules();

  onContentChange(content) {
    this.model.content = content;
    this.saveStream.next();
  }
}
