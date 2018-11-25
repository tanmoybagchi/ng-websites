import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorFocusService, EventManagerService, Result } from 'core';
import { AssetUploader, ASSET_UPLOADER, PageEditBase, PageIdQuery, PageUpdateCommand } from 'material-cms-admin';
import { SitePages, SITE_PAGES } from 'material-cms-view';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { catchError, finalize, map } from 'rxjs/operators';
import { AdminSermon } from './admin-sermon';
import { AdminSermonApprovalRules } from './admin-sermon-approval-rules';

@Component({
  templateUrl: './admin-sermon-edit.component.html',
  styleUrls: ['./admin-sermon-edit.component.scss']
})
export class AdminSermonEditComponent extends PageEditBase<AdminSermon> {
  file: File;
  @ViewChild('newFile') private newFileElRef: ElementRef;
  modelCreator = AdminSermon;
  protected approvalRules = new AdminSermonApprovalRules();

  constructor(
    @Inject(ASSET_UPLOADER) private assetUploader: AssetUploader,
    @Inject(SITE_PAGES) sitePages: SitePages,
    errorFocusService: ErrorFocusService,
    pageIdQuery: PageIdQuery,
    pageUpdateCommand: PageUpdateCommand,
    private eventManagerService: EventManagerService,
    route: ActivatedRoute,
    router: Router,
  ) {
    super(sitePages, errorFocusService, pageIdQuery, pageUpdateCommand, route, router);
  }

  onAddNewClick() {
    this.newFileElRef.nativeElement.click();
  }

  onNewFileChange($event: Event) {
    $event.stopPropagation();
    $event.preventDefault();

    const files = (<HTMLInputElement>this.newFileElRef.nativeElement).files;
    if (!files.length) {
      return;
    }

    this.file = files[0];

    if (!this.isValidFiletype(this.file)) {
      const result = new Result();
      result.addError('This is not an audio file.');
      this.errors = result.errors;
      return;
    }

    this.eventManagerService.raise(ShowThrobberEvent);

    this.assetUploader.uploadAudio(this.file).pipe(
      map(x => this.onUpload(x)),
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe();
  }

  private onUpload(x: AssetUploader.Result) {
    this.model.content.title = this.file.name;
    this.model.content.location = x.location.replace('&export=download', '');
    this.saveStream.next();
  }

  private isValidFiletype(file: File) {
    return file.type.startsWith('audio');
  }
}
