import { Injectable } from '@angular/core';
import { ScrollService } from '../scroll.service';

@Injectable({ providedIn: 'root' })
export class ErrorFocusService {
  constructor(private scrollService: ScrollService) { }

  scrollIntoView() {
    window.setTimeout(() => {
      let errElements = document.getElementsByClassName('generalError');
      if (errElements.length !== 0) {
        // tslint:disable-next-line:no-shadowed-variable
        const errElement = errElements[0] as HTMLElement;
        // tslint:disable-next-line:no-unused-expression
        errElement && this.scrollService.smoothScroll(errElement);
        return;
      }

      errElements = document.getElementsByClassName('mat-form-field-invalid');
      if (errElements.length === 0) {
        return;
      }

      const errElement = errElements[0] as HTMLElement;
      if (!errElement) {
        return;
      }

      this.scrollService.smoothScroll(errElement);

      const inputElement = errElement.getElementsByTagName('input');
      if (inputElement.length !== 0) {
        inputElement[0].select();
        inputElement[0].focus();
        return;
      }

      const selectElement = errElement.getElementsByTagName('select');
      if (selectElement.length !== 0) {
        selectElement[0].focus();
        return;
      }
    }, 50);
  }
}
