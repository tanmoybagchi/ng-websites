import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AutoFocusService {
  constructor() { }

  focusFirst() {
    // tslint:disable-next-line:max-line-length
    window.setTimeout(() => Array.from(document.querySelectorAll('input,textarea,select')).some(x => !((x as HTMLElement).focus(), true)), 50);
  }

  focusFirstEmpty() {
    // tslint:disable-next-line:max-line-length
    window.setTimeout(() => Array.from(document.querySelectorAll('input,textarea,select')).some(x => this.isEmpty(x) && !((x as HTMLElement).focus(), true)), 50);
  }

  private isEmpty(element: Element) {
    if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
      return String.isNullOrWhitespace(element.value);
    }

    return false;
  }
}
