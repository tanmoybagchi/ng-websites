import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { UniqueIdService } from 'core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'input-integer',
  templateUrl: './input-integer.component.html'
})
export class InputIntegerComponent {
  @Input() disabled = false;
  @Input() errMsg: string;
  @Input() hint = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;

  _maxlength = 15;
  @Input()
  set maxlength(value: number) {
    // tslint:disable-next-line:no-unused-expression
    !isNaN(value) && value > 0 && (this._maxlength = value);
  }

  _model: string | number = '';
  @Input()
  set model(value: number) {
    // tslint:disable-next-line:no-unused-expression
    value !== null && value !== undefined && !isNaN(value) && (this._model = value.toString());
  }

  _style: SafeStyle;
  @Input()
  set style(value: string) {
    this._style = this.sanitizer.bypassSecurityTrustStyle(value);
  }

  @Output()
  modelChange: EventEmitter<number>;

  inputName: string;
  errorStateMatcher: ErrorStateMatcher;
  private readonly INTEGER_REGEXP = /^[\+\-]?\d+(,\d{3})*$/;

  constructor(
    private sanitizer: DomSanitizer,
    uniqueIdService: UniqueIdService,
  ) {
    this.inputName = uniqueIdService.getUniqueId().toString();
    this.modelChange = new EventEmitter<number>();
    this.errorStateMatcher = new ErrorStateMatcher();
    this.errorStateMatcher.isErrorState = () => String.hasData(this.errMsg);
  }

  onChange() {
    if (typeof this._model === 'string') {
      if (String.isNullOrWhitespace(this._model)) {
        this.modelChange.emit(null);
        return;
      }

      if (!this.INTEGER_REGEXP.test(this._model)) {
        this.modelChange.emit(NaN);
        return;
      }

      this.modelChange.emit(Number(this._model.replace(/[\,]+/g, '')));
    }

    if (typeof this._model === 'number') {
      this.modelChange.emit(this._model);
    }
  }
}
