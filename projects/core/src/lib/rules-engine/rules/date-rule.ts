import { Rule } from './rule';

export class DateRule extends Rule {
  protected parsedDate: Date = null;

  isBroken(propValue: any) {
    return !this.tryParseDate(propValue);
  }

  protected tryParseDate(propValue: any) {
    if (propValue instanceof Date) {
      if (isNaN(propValue.valueOf())) {
        return false;
      }

      this.parsedDate = propValue;
      return true;
    }

    const dateParts = propValue.split('/');
    if (dateParts.length !== 3) {
      return false;
    }

    const month = Number(dateParts[0]);
    const day = Number(dateParts[1]);
    let year = Number(dateParts[2]);

    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      return false;
    }

    if (year < 100) {
      year = (year < 50) ? 2000 + year : 1900 + year;
    }

    const parsedDate = new Date(year, month - 1, day);
    // if (isNaN(parsedDate)) {
    //  return null;
    // }

    if ((parsedDate.getMonth() + 1) !== month) {
      return false;
    }

    if (parsedDate.getDate() !== day) {
      return false;
    }

    if (parsedDate.getFullYear() !== year && (parsedDate.getFullYear() % 100) !== year) {
      return false;
    }

    this.parsedDate = parsedDate;
    return true;
  }
}
