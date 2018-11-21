import { Component, Input } from '@angular/core';
import { Entity } from 'core';

@Component({
  selector: 'cms-page-status',
  templateUrl: './page-status.component.html'
})
export class PageStatusComponent {
  @Input() model: Entity;
}
