import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment';
import { ServiceAccountSignin } from 'gapi';
import { map } from 'rxjs/operators';
import { EventList } from './events-models';
import { EventsModule } from './events.module';

@Injectable({ providedIn: EventsModule })
export class EventsQuery {
  private url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = `https://www.googleapis.com/calendar/v3/calendars/${env.g_oauth_login_hint}/events`;
  }

  @ServiceAccountSignin()
  execute(maxResultsOrTimeMax: number | Date = 3, timeMin = new Date()) {
    const eventsInput = {
      timeMin: timeMin.toISOString(),
      fields: 'items(id,start,end,location,summary,description,htmlLink)',
      orderBy: 'startTime',
      showDeleted: 'false',
      singleEvents: 'true'
    };

    if (typeof maxResultsOrTimeMax === 'number') {
      (eventsInput as any).maxResults = maxResultsOrTimeMax.toString();
    }

    if (maxResultsOrTimeMax instanceof Date) {
      (eventsInput as any).timeMax = maxResultsOrTimeMax.toISOString();
    }

    return this.http.get<EventList>(this.url, { params: new HttpParams({ fromObject: eventsInput }) }).pipe(
      map(x => EventList.convertFromJson(x))
    );
  }
}
