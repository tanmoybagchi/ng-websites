import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DomainEvent } from './domain-event';

@Injectable({ providedIn: 'root' })
export class EventManagerService {
  private eventSource = new Subject<DomainEvent>();

  constructor() { }

  raise<T extends DomainEvent>(domainEvent: { new(): T } | T) {
    if (domainEvent === null || domainEvent === undefined) {
      throw new Error('domainEvent missing');
    }

    let eventToRaise: T;

    if (typeof domainEvent === 'function') {
      eventToRaise = new (domainEvent as any)();
    } else if (typeof domainEvent === 'object') {
      eventToRaise = domainEvent;
    }

    if (!eventToRaise || !(eventToRaise instanceof DomainEvent)) {
      throw new Error('domainEvent type invalid - it must be a class derived from DomainEvent');
    }

    this.eventSource.next(eventToRaise);
  }

  handle<T extends DomainEvent>(domainEvent: { new(): T }) {
    return this.eventSource.pipe(
      filter((value) => value instanceof domainEvent)
    );
  }
}
