import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventManagerService, LocalStorageService, Result } from 'core';
import { DriveFileSearchQuery, DriveMimeTypes, DriveUploadCommand } from 'gapi';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  templateUrl: './files.component.html'
})
export class FilesComponent implements OnInit {
  file: File;
  errors: any;
  model: DriveFileSearchQuery.Result[];
  @ViewChild('newFile') private newFileElRef: ElementRef;

  constructor(
    private driveFileSearchQuery: DriveFileSearchQuery,
    private eventManagerService: EventManagerService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private uploadCommand: DriveUploadCommand,
  ) { }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.driveFileSearchQuery.execute('', undefined, DriveMimeTypes.Spreadsheet).pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(queryResult => this.model = queryResult);
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
      result.addError('This is not a spreadsheet.');
      this.errors = result.errors;
      return;
    }

    this.eventManagerService.raise(ShowThrobberEvent);

    this.uploadCommand.execute(this.file, DriveMimeTypes.Spreadsheet).pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.onUpload(_));
  }

  onUpload(item) {
    this.localStorageService.set('spreadsheetId', item.id);
    this.router.navigate(['sheet'], { relativeTo: this.route });
  }

  private isValidFiletype(file: File) {
    return String.isNullOrWhitespace(file.type) ?
      file.name.endsWith('.csv') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx') :
      file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }

  private onError(errors) {
    this.errors = errors;
    return EMPTY;
  }
}
