import { Component, Inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorFocusService, EventManagerService, Result } from 'core';
import { AssetUploader, ASSET_UPLOADER, PageEditBase, PageIdQuery, PageUpdateCommand } from 'material-cms-admin';
import { SitePages, SITE_PAGES } from 'material-cms-view';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AdminCaller } from './admin-caller';
import { AdminCallerApprovalRules } from './admin-caller-approval-rules';

@Component({
  templateUrl: './admin-caller-edit.component.html'
})
export class AdminCallerEditComponent extends PageEditBase<AdminCaller> {
  sanitizedLocation: SafeResourceUrl;
  file: File;
  modelCreator = AdminCaller;
  protected approvalRules = new AdminCallerApprovalRules();

  constructor(
    @Inject(ASSET_UPLOADER) private assetUploader: AssetUploader,
    @Inject(SITE_PAGES) sitePages: SitePages,
    errorFocusService: ErrorFocusService,
    eventManagerService: EventManagerService,
    pageIdQuery: PageIdQuery,
    pageUpdateCommand: PageUpdateCommand,
    private sanitizer: DomSanitizer,
    route: ActivatedRoute,
    router: Router,
  ) {
    super(sitePages, eventManagerService, errorFocusService, pageIdQuery, pageUpdateCommand, route, router);
  }

  onPage(model: AdminCaller) {
    super.onPage(model);
    if (String.hasData(this.model.content.location)) {
      this.sanitizedLocation = this.sanitizer.bypassSecurityTrustResourceUrl(this.model.content.location);
    }
  }

  onEffectiveFromChange($event) {
    this.model.effectiveFrom = $event;
    this.saveStream.next();
  }

  onTitleChange($event) {
    this.model.content.title = $event;
    this.saveStream.next();
  }

  onFiles(files: FileList) {
    if (!files.length) {
      return;
    }

    this.file = files[0];

    if (!this.isValidFiletype(this.file)) {
      const result = new Result();
      result.addError('This is not a document.');
      this.errors = result.errors;
      return;
    }

    this.eventManagerService.raise(ShowThrobberEvent);

    this.assetUploader.uploadDocument(this.file).pipe(
      tap(x => this.onUpload(x)),
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe();
  }

  private onUpload(x: AssetUploader.Result) {
    this.model.content.title = this.file.name;
    this.model.content.location = x.location.replace('&export=download', '');
    this.sanitizedLocation = this.sanitizer.bypassSecurityTrustResourceUrl(this.model.content.location);
    this.saveStream.next();
  }

  private isValidFiletype(file: File) {
    return file.type === 'application/pdf';
  }
}
