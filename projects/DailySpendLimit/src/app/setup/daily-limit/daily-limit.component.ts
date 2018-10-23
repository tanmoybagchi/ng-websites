import { Component, OnInit } from '@angular/core';
import { Config } from '../../domain/models';

@Component({
  selector: 'app-daily-limit',
  templateUrl: './daily-limit.component.html',
  styleUrls: ['./daily-limit.component.scss']
})
export class DailyLimitComponent implements OnInit {
  errors: any;
  model: Config;

  constructor() {
    this.model = new Config();
  }

  ngOnInit() {
  }

  onSubmit() {
  }
}
