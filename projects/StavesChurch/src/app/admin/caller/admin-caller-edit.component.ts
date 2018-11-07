import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoFocusService, ErrorFocusService, EventManagerService, Result } from 'core';
import { DriveUploadCommand } from 'gapi';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { catchError, finalize, tap } from 'rxjs/operators';
import { PageUpdateCommand } from '../page/commands/page-update-command.service';
import { PageEditBase } from '../page/page-edit-base';
import { PageIdQuery } from '../page/queries/page-id-query.service';
import { AdminCaller } from './admin-caller';
import { AdminCallerApprovalRules } from './admin-caller-approval-rules';

@Component({
  templateUrl: './admin-caller-edit.component.html',
  styleUrls: ['./admin-caller-edit.component.scss']
})
export class AdminCallerEditComponent extends PageEditBase<AdminCaller> {
  sanitizedLocation: SafeResourceUrl;
  file: File;
  @ViewChild('newFile') private newFileElRef: ElementRef;
  modelCreator = AdminCaller;
  protected approvalRules = new AdminCallerApprovalRules();

  constructor(
    autoFocusService: AutoFocusService,
    errorFocusService: ErrorFocusService,
    pageIdQuery: PageIdQuery,
    pageUpdateCommand: PageUpdateCommand,
    private driveUploadCommand: DriveUploadCommand,
    private eventManagerService: EventManagerService,
    private sanitizer: DomSanitizer,
    route: ActivatedRoute,
    router: Router,
  ) {
    super(autoFocusService, errorFocusService, pageIdQuery, pageUpdateCommand, route, router);
  }

  onPage(model: AdminCaller) {
    super.onPage(model);
    if (String.hasData(this.model.content.location)) {
      this.sanitizedLocation = this.sanitizer.bypassSecurityTrustResourceUrl(this.model.content.location);
    }
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
      result.addError('This is not a document.');
      this.errors = result.errors;
      return;
    }

    this.eventManagerService.raise(ShowThrobberEvent);

    this.driveUploadCommand.execute(this.file).pipe(
      tap(x => this.onUpload(x)),
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe();
  }

  private onUpload(x: any) {
    this.model.content.title = this.file.name;
    this.model.content.location = x.webContentLink.replace('&export=download', '');
    this.sanitizedLocation = this.sanitizer.bypassSecurityTrustResourceUrl(this.model.content.location);
    this.saveStream.next();
  }

  private isValidFiletype(file: File) {
    return file.type === 'application/pdf';
  }
}
