declare global {
  interface StringConstructor {
    isNullOrWhitespace(arg: string): boolean;
    hasData(arg: string): boolean;
    toDate(arg: any): Date;
  }
}

if (!String.isNullOrWhitespace) {
  String.isNullOrWhitespace = function (arg: string): boolean {
    if (arg == null) {
      return true;
    }

    return arg.trim().length < 1;
  };
}

if (!String.hasData) {
  String.hasData = function (arg: string): boolean {
    return !String.isNullOrWhitespace(arg);
  };
}

if (!String.toDate) {
  String.toDate = function (arg: any): Date {
    if (arg === undefined || arg === null || arg === '') {
      return null;
    }

    if (arg instanceof Date) {
      return arg;
    }

    if (!(arg instanceof String)) {
      return null;
    }

    const dateParts = arg.split('/');
    if (dateParts.length !== 3) {
      return null;
    }

    const month = Number(dateParts[0]);
    const day = Number(dateParts[1]);
    let year = Number(dateParts[2]);

    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      return null;
    }

    if (year < 100) {
      year = (year < 50) ? 2000 + year : 1900 + year;
    }

    const parsedDate = new Date(year, month - 1, day);
    // if (isNaN(parsedDate)) {
    //  return null;
    // }

    if ((parsedDate.getMonth() + 1) !== month) {
      return null;
    }

    if (parsedDate.getDate() !== day) {
      return null;
    }

    if (parsedDate.getFullYear() !== year && (parsedDate.getFullYear() % 100) !== year) {
      return null;
    }

    return parsedDate;
  };
}

// tslint:disable-next-line:class-name
export class this_empty_class_needs_to_be_the_last_line_to_suppress_compile_errors { }
