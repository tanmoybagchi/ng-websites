import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'choose-external-link',
  templateUrl: './choose-external-link.component.html'
})
export class ChooseExternalLinkComponent implements OnInit {
  @Output() done = new EventEmitter<string>();
  extUrl = '';
  extUrlError = '';
  extUrlErrorStateMatcher = new ErrorStateMatcher();

  constructor() { }

  ngOnInit() {
    this.extUrlErrorStateMatcher.isErrorState = () => false;
  }

  onOKClick() {
    if (!String.isNullOrWhitespace(this.extUrl) && !this.isValidUrl(this.extUrl)) {
      this.extUrlError = 'Please enter a valid link.';
      this.extUrlErrorStateMatcher.isErrorState = () => true;
      return;
    }

    this.done.emit(this.extUrl);
  }

  private isValidUrl(value: string) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    return pattern.test(value);
  }
}
