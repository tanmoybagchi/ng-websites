import { Component } from '@angular/core';
import { Wine } from '@app/wines/wines';
import { PageEditBase } from 'material-cms-admin';
import { AdminWinesPage, AdminWineType } from './admin-wines';
import { AdminWinesApprovalRules } from './admin-wines-approval-rules';

@Component({
  templateUrl: './admin-wines-edit.component.html',
  styleUrls: ['./admin-wines-edit.component.scss']
})
export class AdminWinesEditComponent extends PageEditBase<AdminWinesPage> {
  modelCreator = AdminWinesPage;
  protected approvalRules = new AdminWinesApprovalRules();

  onEffectiveFromChange($event) {
    this.model.effectiveFrom = $event;
    this.saveStream.next();
  }

  onPage(model: AdminWinesPage) {
    if (model.content.wineTypes.length === 0) {
      model.content.wineTypes.push(new AdminWineType());
    }

    model.content.wineTypes.forEach(wt => {
      if (wt.wines.length === 0) {
        wt.wines.push(new Wine());
      }
    });

    super.onPage(model);
  }

  onItemChange(item, key: string, newValue) {
    item[key] = newValue;
    this.saveStream.next();
  }

  addAfter(list, item) {
    list.addAfter(item);
    this.saveStream.next();
  }

  remove(list, item) {
    list.remove(item);
    this.saveStream.next();
  }

  moveUp(list, item) {
    list.moveUp(item);
    this.saveStream.next();
  }

  moveDown(list, item) {
    list.moveDown(item);
    this.saveStream.next();
  }
}
