import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EventManagerService, Result } from 'core';
import { Page } from 'material-cms-view';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { PageApproveCommand, PageApproveResult } from '../commands/page-approve-command.service';
import { PageChangeCommand, PageChangeResult } from '../commands/page-change-command.service';
import { PageDeleteCommand, PageDeleteResult } from '../commands/page-delete-command.service';
import { PageRecallCommand, PageRecallResult } from '../commands/page-recall-command.service';
import { PageRecoverCommand, PageRecoverResult } from '../commands/page-recover-command.service';

@Component({
  selector: 'cms-page-command-buttons',
  templateUrl: './page-command-buttons.component.html'
})
export class PageCommandButtonsComponent {
  private _model: Page;
  @Input()
  set model(v: Page) {
    this._model = v;
    // tslint:disable-next-line:no-unused-expression
    v && this.setButtonVisibility();
  }

  @Input() allowOverlap = false;
  @Output() approve = new EventEmitter<PageApproveResult>(true);
  @Output() change = new EventEmitter<PageChangeResult>(true);
  @Output() delete = new EventEmitter<PageDeleteResult>(true);
  @Output() error = new EventEmitter<Result>(true);
  @Output() recall = new EventEmitter<PageRecallResult>(true);
  @Output() recover = new EventEmitter<PageRecoverResult>(true);

  canApprove = false;
  canChange = false;
  canDelete = false;
  canRecall = false;
  canRecover = false;

  private forceRecall = false;

  @ViewChild('recallWarning') recallWarningDialog: any;

  @Input() preApproveCheck = () => true;
  @Input() preChangeCheck = () => true;
  @Input() preDeleteCheck = () => true;
  @Input() preRecallCheck = () => true;
  @Input() preRecoverCheck = () => true;

  constructor(
    private approveCommand: PageApproveCommand,
    private changeCommand: PageChangeCommand,
    private deleteCommand: PageDeleteCommand,
    private dialog: MatDialog,
    private eventManagerService: EventManagerService,
    private recallCommand: PageRecallCommand,
    private recoverCommand: PageRecoverCommand,
  ) { }

  setButtonVisibility() {
    const now = Date.now();

    this.canApprove = this._model.status === 'Draft';
    this.canChange = this._model.status === 'Approved' || this._model.status === 'Recalled';
    // tslint:disable-next-line:max-line-length
    this.canDelete = this._model.status === 'Draft' || (this._model.status === 'Approved' && this._model.effectiveFrom.valueOf() > now);
    this.canRecall = (this._model.status === 'Approved' && this._model.effectiveFrom.valueOf() <= now);
    this.canRecover = this._model.status === 'Deleted';
  }

  onApproveClick() {
    if (!this.preApproveCheck()) {
      return;
    }

    this.eventManagerService.raise(ShowThrobberEvent);

    this.approveCommand.execute(this._model, this.allowOverlap).pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(res => {
      this._model.status = res.status;
      this.setButtonVisibility();
      this.approve.emit(res);
    });
  }

  onChangeClick() {
    if (!this.preChangeCheck()) {
      return;
    }

    this.eventManagerService.raise(ShowThrobberEvent);

    this.changeCommand.execute(this._model).pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(res => {
      this._model.status = res.status;
      this.setButtonVisibility();
      this.change.emit(res);
    });
  }

  onDeleteClick() {
    if (!this.preDeleteCheck()) {
      return;
    }

    this.eventManagerService.raise(ShowThrobberEvent);

    this.deleteCommand.execute(this._model).pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(res => {
      this._model.status = res.status;
      this.setButtonVisibility();
      this.delete.emit(res);
    });
  }

  onRecallClick() {
    if (!this.preRecallCheck()) {
      return;
    }

    this.eventManagerService.raise(ShowThrobberEvent);

    this.recallCommand.execute(this._model, this.forceRecall).pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(res => {
      this.forceRecall = false;
      this._model.status = res.status;
      this.setButtonVisibility();
      this.recall.emit(res);
    });
  }

  onRecoverClick() {
    if (!this.preRecoverCheck()) {
      return;
    }

    this.eventManagerService.raise(ShowThrobberEvent);

    this.recoverCommand.execute(this._model).pipe(
      catchError(err => this.onError(err)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(res => {
      this._model.status = res.status;
      this.setButtonVisibility();
      this.recover.emit(res);
    });
  }

  private onError(result: Result) {
    if (result.errors.general && result.errors.general.noMoreApproved) {
      const dialogRef = this.dialog.open(this.recallWarningDialog);

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.forceRecall = true;
          this.onRecallClick();
        }
      });
    } else {
      this.error.emit(result);
    }
    return EMPTY;
  }
}
