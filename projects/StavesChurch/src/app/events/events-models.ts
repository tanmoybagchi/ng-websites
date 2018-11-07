export class EventList {
  items: EventSummary[];

  static convertFromJson(item: any) {
    const returnValue = new EventList();

    returnValue.items = item.items.map(x => EventSummary.convertFromJson(x));

    return returnValue;
  }
}

export class EventSummary {
  id: string;
  summary: string;
  description: string;
  location: string;
  start: Date;
  end: Date;

  static convertFromJson(item: any) {
    const returnValue = new EventSummary();

    returnValue.id = item.id;
    returnValue.summary = item.summary;
    // tslint:disable-next-line:no-unused-expression
    String.hasData(item.description) && (returnValue.description = item.description);
    // tslint:disable-next-line:no-unused-expression
    String.hasData(item.location) && (returnValue.location = item.location);

    if (typeof item.start === 'object') {
      if (typeof item.start.date === 'string') {
        if (String.hasData(item.start.date)) {
          const dateParts = item.start.date.split('-');
          returnValue.start = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]), 0, 0, 0, 0);
        }
      }

      if (typeof item.start.dateTime === 'string') {
        returnValue.start = String.hasData(item.start.dateTime) ? new Date(item.start.dateTime) : null;
      }
    }

    if (typeof item.end === 'object') {
      if (typeof item.end.date === 'string') {
        if (String.hasData(item.end.date)) {
          const dateParts = item.end.date.split('-');
          const endDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]) - 1, 0, 0, 0, 0);
          if (endDate.valueOf() !== returnValue.start.valueOf()) {
            returnValue.end = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]) - 1, 23, 59, 59, 59);
          }
        }
      }

      if (typeof item.end.dateTime === 'string') {
        returnValue.end = String.hasData(item.end.dateTime) ? new Date(item.end.dateTime) : null;
      }
    }

    return returnValue;
  }
}
