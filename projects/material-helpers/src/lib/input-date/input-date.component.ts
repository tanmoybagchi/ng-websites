import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { UniqueIdService } from 'core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss']
})
export class InputDateComponent {
  @Input() disabled = false;
  @Input() errMsg: string;
  @Input() hint = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;

  _model: Date = null;
  @Input()
  set model(value: Date) {
    // tslint:disable-next-line:no-unused-expression
    value !== null && value !== undefined && (this._model = value);
  }

  _maxlength = 10;
  @Input()
  set maxlength(value: number) {
    // tslint:disable-next-line:no-unused-expression
    !isNaN(value) && value > 0 && (this._maxlength = value);
  }

  _style: SafeStyle;
  @Input()
  set style(value: string) {
    this._style = this.sanitizer.bypassSecurityTrustStyle(value);
  }

  // tslint:disable-next-line:no-output-rename
  @Output()
  modelChange: EventEmitter<Date>;

  inputName: string;
  errorStateMatcher: ErrorStateMatcher;

  constructor(
    private sanitizer: DomSanitizer,
    uniqueIdService: UniqueIdService
  ) {
    this.inputName = uniqueIdService.getUniqueId().toString();

    this.modelChange = new EventEmitter<Date>();

    this.errorStateMatcher = new ErrorStateMatcher();
    this.errorStateMatcher.isErrorState = () => String.hasData(this.errMsg);
  }

  onChange() {
    this.modelChange.emit(this._model);
  }
}
