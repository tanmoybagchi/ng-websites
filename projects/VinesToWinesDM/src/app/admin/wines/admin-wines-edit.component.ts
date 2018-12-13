import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Wine, WineType } from '@app/wines/wines';
import { ErrorFocusService } from 'core';
import { PageEditBase, PageIdQuery, PageUpdateCommand } from 'material-cms-admin';
import { Photo, PhotoGetQuery, SitePages, SITE_PAGES } from 'material-cms-view';
import { AdminWinesPage, AdminWineType } from './admin-wines';
import { AdminWinesApprovalRules } from './admin-wines-approval-rules';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './admin-wines-edit.component.html',
  styleUrls: ['./admin-wines-edit.component.scss']
})
export class AdminWinesEditComponent extends PageEditBase<AdminWinesPage> {
  modelCreator = AdminWinesPage;
  choosingPhoto = false;
  protected approvalRules = new AdminWinesApprovalRules();
  private itemWorkedOn: Wine;

  constructor(
    @Inject(SITE_PAGES) sitePages: SitePages,
    errorFocusService: ErrorFocusService,
    pageIdQuery: PageIdQuery,
    pageUpdateCommand: PageUpdateCommand,
    private photoGetQuery: PhotoGetQuery,
    route: ActivatedRoute,
    router: Router,
  ) {
    super(sitePages, errorFocusService, pageIdQuery, pageUpdateCommand, route, router);
  }

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

  onSetPhoto(item: Wine, parent: WineType) {
    this.model.content.wineTypes.forEach(wt => {
      (wt as any).expanded = false;
      wt.wines.forEach((w: any) => w.expanded = false);
    });

    (item as any).expanded = true;
    (parent as any).expanded = true;

    this.choosingPhoto = true;
    this.itemWorkedOn = item;
  }

  onPhotoListDone(photoId: number) {
    this.choosingPhoto = false;

    if (photoId === undefined || photoId === null || photoId === 0) {
      if (this.itemWorkedOn.photoId > 0) {
        this.itemWorkedOn.photoId = 0;
        this.saveStream.next();
      }

      this.itemWorkedOn = null;
      return;
    }

    this.itemWorkedOn.photoId = photoId;

    this.photoGetQuery.execute(photoId).pipe(
      tap(photo => (this.itemWorkedOn as any).photo = photo.smallThumbnail)
    ).subscribe();
  }
}
