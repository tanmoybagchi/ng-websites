import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'page-title',
  templateUrl: './page-title.component.html'
})
export class PageTitleComponent implements OnInit {
  @Input() name = '';
  @Input() canAddNew = false;
  @Output() addNew = new EventEmitter<{}>(true);

  constructor() { }

  ngOnInit() {
  }

  onAddNew() {
    this.addNew.emit();
  }
}
