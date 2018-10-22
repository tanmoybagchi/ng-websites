import { Rule } from './rule';

export class EmailRule extends Rule {
  // http://stackoverflow.com/a/46181
  // tslint:disable-next-line:max-line-length
  private readonly emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  isBroken(propValue: any) {
    return !this.emailRegExp.test(propValue);
  }
}
