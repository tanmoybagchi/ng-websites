import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { PhotoQuery } from '@app/photo/photo-query.service';
import { EventManagerService, LocalStorageService } from 'core';
import { PageCreateCommand } from '../page/commands/page-create-command.service';
import { PageListBase, PageListItem } from '../page/page-list-base';
import { PageListQuery } from '../page/queries/page-list-query.service';
import { AdminHomepage } from './admin-homepage';

@Component({
  templateUrl: './admin-homepage-list.component.html'
})
export class AdminHomepageListComponent extends PageListBase<AdminHomepage, AdminHomepageListItem> implements OnInit {
  displayedColumns = ['effectiveFrom', 'status', 'bannerPhoto', 'action'];

  constructor(
    createCommand: PageCreateCommand,
    eventManagerService: EventManagerService,
    listQuery: PageListQuery,
    private photoCurrentQuery: PhotoQuery,
    route: ActivatedRoute,
    router: Router,
    storage: LocalStorageService,
  ) {
    super(createCommand, eventManagerService, listQuery, route, router, storage);
  }

  ngOnInit() {
    this.onParams(convertToParamMap({ kind: 'homepage' }));
  }

  setFullList(list: AdminHomepage[]) {
    this.fullList = list.map(x => new AdminHomepageListItem(x, this.photoCurrentQuery));
  }
}

export class AdminHomepageListItem extends PageListItem {
  bannerPhotoUrl: string;

  constructor(model: AdminHomepage, photoCurrentQuery: PhotoQuery) {
    super(model);

    if (typeof (model.content) === 'string') {
      model.content = String.hasData(model.content) ? JSON.parse(model.content) : null;
    }

    if (model.content && String.hasData(model.content.bannerPhotoIdentifier)) {
      photoCurrentQuery.execute().subscribe(photos => {
        const bannerPhoto = photos.filter(x => x.identifier === model.content.bannerPhotoIdentifier);
        // tslint:disable-next-line:no-unused-expression
        bannerPhoto.length === 1 && (this.bannerPhotoUrl = bannerPhoto[0].smallThumbnail.location);
      });
    }
  }
}
