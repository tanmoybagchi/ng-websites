import { Component, OnInit } from '@angular/core';
import { Setup } from '../models';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  errors: any;
  model: Setup;

  constructor() {
    this.model = new Setup();
  }

  ngOnInit() {
  }

  onSubmit() {
  }
}
