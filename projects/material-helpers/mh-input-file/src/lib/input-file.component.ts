import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'input-file',
  templateUrl: './input-file.component.html'
})
export class InputFileComponent {
  @Input() accept = '';
  @Input() label = 'Choose file';
  @Input() multiple = false;
  @Output() change: EventEmitter<FileList>;

  constructor() {
    this.change = new EventEmitter<FileList>();
  }

  onChange($event: Event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.change.emit((<HTMLInputElement>$event.target).files);
  }
}
