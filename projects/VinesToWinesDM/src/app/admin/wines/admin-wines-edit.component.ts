import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Wine } from '@app/wines/wines';
import { DomainHelper, ErrorFocusService } from 'core';
import { PageEditBase, PageIdQuery, PageUpdateCommand, PageUpdateResult } from 'material-cms-admin';
import { PhotoContent, PhotoGetQuery, PhotoListQuery, SitePages, SITE_PAGES } from 'material-cms-view';
import { tap } from 'rxjs/operators';
import { AdminWines, AdminWinesPage, AdminWineType } from './admin-wines';
import { AdminWinesApprovalRules } from './admin-wines-approval-rules';

@Component({
  templateUrl: './admin-wines-edit.component.html',
  styleUrls: ['./admin-wines-edit.component.scss']
})
export class AdminWinesEditComponent extends PageEditBase<AdminWinesPage> {
  modelCreator = AdminWinesPage;
  choosingPhoto = false;
  protected approvalRules = new AdminWinesApprovalRules();
  private itemWorkedOn: AdminWineVM;
  vm: AdminWinesPageVM;

  constructor(
    @Inject(SITE_PAGES) sitePages: SitePages,
    errorFocusService: ErrorFocusService,
    pageIdQuery: PageIdQuery,
    pageUpdateCommand: PageUpdateCommand,
    private photoGetQuery: PhotoGetQuery,
    private photoListQuery: PhotoListQuery,
    route: ActivatedRoute,
    router: Router,
  ) {
    super(sitePages, errorFocusService, pageIdQuery, pageUpdateCommand, route, router);
    this.vm = new AdminWinesPageVM();
  }

  onEffectiveFromChange($event) {
    this.vm.effectiveFrom = $event;
    this.save();
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

    this.vm = DomainHelper.adapt(AdminWinesPageVM, model);

    this.photoListQuery.execute().pipe(
      tap(photos => {
        this.vm.content.wineTypes.forEach(wt => {
          wt.wines
            .filter(w => w.photoId > 0)
            .forEach(w => {
              const photo = photos.find(p => p.id === w.photoId);
              // tslint:disable-next-line:no-unused-expression
              photo && (w.photo = photo.smallThumbnail);
            });
        });
      })
    ).subscribe();

    super.onPage(model);
  }

  onItemChange(item, key: string, newValue) {
    item[key] = newValue;
    this.save();
  }

  addAfter(list, item, $event: Event) {
    $event.preventDefault();
    $event.stopPropagation();

    list.addAfter(item);
    this.save();
  }

  remove(list, item, $event: Event) {
    $event.preventDefault();
    $event.stopPropagation();

    list.remove(item);
    this.save();
  }

  moveUp(list, item, $event: Event) {
    $event.preventDefault();
    $event.stopPropagation();

    list.moveUp(item);
    this.save();
  }

  moveDown(list, item, $event: Event) {
    $event.preventDefault();
    $event.stopPropagation();

    list.moveDown(item);
    this.save();
  }

  onSetPhoto(item: AdminWineVM, parent: AdminWineTypeVM) {
    this.vm.content.wineTypes.forEach(wt => {
      wt.expanded = false;
      wt.wines.forEach(w => w.expanded = false);
    });

    item.expanded = true;
    parent.expanded = true;

    this.choosingPhoto = true;
    this.itemWorkedOn = item;
  }

  onPhotoListDone(photoId: number) {
    this.choosingPhoto = false;

    if (photoId === undefined || photoId === null || photoId === 0) {
      if (this.itemWorkedOn.photoId > 0) {
        this.itemWorkedOn.photoId = 0;
        this.itemWorkedOn.photo = null;
        this.save();
      }

      this.itemWorkedOn = null;
      return;
    }

    this.itemWorkedOn.photoId = photoId;
    this.save();

    this.photoGetQuery.execute(photoId).pipe(
      tap(photo => this.itemWorkedOn.photo = photo.smallThumbnail)
    ).subscribe();
  }

  private save() {
    this.model = DomainHelper.adapt(AdminWinesPage, this.vm);
    this.saveStream.next();
  }

  onUpdate(result: PageUpdateResult) {
    super.onUpdate(result);

    this.vm.status = result.status;
    this.vm.savedBy = result.savedBy;
    this.vm.savedOn = result.savedOn;
    this.vm.version = result.version;
  }
}

class AdminWineVM extends Wine {
  expanded = false;
  photo: PhotoContent;
}

class AdminWineTypeVM extends AdminWineType {
  expanded = false;
  @Reflect.metadata('design:type', AdminWineVM)
  wines: AdminWineVM[] = [];
}

class AdminWinesVM extends AdminWines {
  @Reflect.metadata('design:type', AdminWineTypeVM)
  wineTypes: AdminWineTypeVM[] = [];
}

class AdminWinesPageVM extends AdminWinesPage {
  content = new AdminWinesVM();
}
