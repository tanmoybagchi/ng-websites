import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { UniqueIdService } from 'core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'input-usd',
  templateUrl: './input-usd.component.html',
  providers: [DecimalPipe]
})
export class InputUSDComponent {
  @Input() disabled = false;
  @Input() errMsg: string;
  @Input() hint = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;

  _model: string | number = '';
  @Input()
  set model(value: number) {
    if (value === undefined || value === null) {
      this._model = '';
    } else if (Number.isNaN(value)) {
      this._model = value.toString();
    } else {
      this._model = this.pipe.transform(value, '1.2-2');
    }
  }

  _style: SafeStyle;
  @Input()
  set style(value: string) {
    this._style = this.sanitizer.bypassSecurityTrustStyle(value);
  }

  // tslint:disable-next-line:no-output-rename
  @Output()
  modelChange: EventEmitter<number>;

  inputName: string;
  errorStateMatcher: ErrorStateMatcher;
  private readonly USD_REGEXP = /^[\+\-]?\$?\d+(,\d{3})*(\.[0-9]{2})?$/;

  constructor(
    private pipe: DecimalPipe,
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

      if (!this.USD_REGEXP.test(this._model)) {
        this.modelChange.emit(NaN);
        return;
      }

      this.modelChange.emit(Number(this._model.replace(/[\$\,]+/g, '')));
    }

    if (typeof this._model === 'number') {
      this.modelChange.emit(this._model);
    }
  }
}
