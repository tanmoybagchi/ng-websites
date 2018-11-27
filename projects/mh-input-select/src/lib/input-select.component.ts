import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import { UniqueIdService } from 'core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'input-select',
  templateUrl: './input-select.component.html'
})
export class InputSelectComponent {
  @Input() disabled = false;
  @Input() errMsg = '';
  @Input() hint = '';
  @Input() label = '';
  @Input() required = false;
  @Input() model = 0;
  @Input() items: SelectItem[] = [];

  @Output()
  modelChange: EventEmitter<number>;

  inputName: string;
  errorStateMatcher: ErrorStateMatcher;

  constructor(
    uniqueIdService: UniqueIdService,
  ) {
    this.inputName = uniqueIdService.getUniqueId().toString();
    this.modelChange = new EventEmitter<number>();
    this.errorStateMatcher = new ErrorStateMatcher();
    this.errorStateMatcher.isErrorState = () => String.hasData(this.errMsg);
  }

  onChange() {
    this.modelChange.emit(Number(this.model));
  }
}

export class SelectItem {
  key = 0;
  value = '';
}
