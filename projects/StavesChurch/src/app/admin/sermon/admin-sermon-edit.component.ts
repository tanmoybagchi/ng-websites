import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEditBase } from '@app/admin/page/page-edit-base';
import { environment as env } from '@env/environment';
import { AutoFocusService, ErrorFocusService, EventManagerService, Result } from 'core';
import { DriveFile, DriveUploadCommand } from 'gapi';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { catchError, finalize, map } from 'rxjs/operators';
import { PageUpdateCommand } from '../page/commands/page-update-command.service';
import { PageIdQuery } from '../page/queries/page-id-query.service';
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
    autoFocusService: AutoFocusService,
    errorFocusService: ErrorFocusService,
    pageIdQuery: PageIdQuery,
    pageUpdateCommand: PageUpdateCommand,
    private driveUploadCommand: DriveUploadCommand,
    private eventManagerService: EventManagerService,
    route: ActivatedRoute,
    router: Router,
  ) {
    super(autoFocusService, errorFocusService, pageIdQuery, pageUpdateCommand, route, router);
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

    this.driveUploadCommand.execute(this.file, `${env.rootFolder}\\${env.assetFolder}`).pipe(
      map(x => this.onUpload(x)),
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe();
  }

  private onUpload(x: DriveFile) {
    this.model.content.title = this.file.name;
    this.model.content.location = x.webContentLink.replace('&export=download', '');
    this.saveStream.next();
  }

  private isValidFiletype(file: File) {
    return file.type.startsWith('audio');
  }
}
