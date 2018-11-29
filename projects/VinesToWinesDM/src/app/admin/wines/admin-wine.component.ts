import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Wine } from '@app/wines/wines';
import { AdminWines } from './admin-wines';

@Component({
  selector: 'admin-wine',
  templateUrl: './admin-wine.component.html'
})
export class AdminWineComponent implements OnInit {
  @Input() model = new AdminWines();
  @Input() kind: 'reds' | 'whites' | 'speciality';
  @Input() name = '';
  @Input() errors: any;
  @Output() modelChange = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onNameChange(item: Wine, $event) {
    item.name = $event;
    this.modelChange.emit();
  }

  onDescriptionChange(item: Wine, $event) {
    item.description = $event;
    this.modelChange.emit();
  }

  addAfter(item: Wine) {
    this.model.addAfter(item, this.kind);
    this.modelChange.emit();
  }

  remove(item: Wine) {
    this.model.remove(item, this.kind);
    this.modelChange.emit();
  }

  moveUp(item: Wine) {
    this.model.moveUp(item, this.kind);
    this.modelChange.emit();
  }

  moveDown(item: Wine) {
    this.model.moveDown(item, this.kind);
    this.modelChange.emit();
  }
}
