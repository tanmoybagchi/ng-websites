import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment';
import { ServiceAccountSignin } from 'gapi';
import { map } from 'rxjs/operators';
import { EventList } from './events-models';
import { EventsModule } from './events.module';

@Injectable({ providedIn: EventsModule })
export class EventsQuery {
  constructor(
    private http: HttpClient
  ) { }

  @ServiceAccountSignin()
  execute(maxResults = '3', timeMin = new Date()) {
    const eventsInput = {
      timeMin: timeMin.toISOString(),
      fields: 'items(id,start,end,location,summary,description)',
      maxResults: maxResults,
      orderBy: 'startTime',
      showDeleted: 'false',
      singleEvents: 'true'
    };

    const httpParams = new HttpParams({ fromObject: eventsInput });

    const url = `https://www.googleapis.com/calendar/v3/calendars/${env.login_hint}/events`;

    return this.http.get<EventList>(url, { params: httpParams }).pipe(
      map(x => EventList.convertFromJson(x))
    );
  }
}
