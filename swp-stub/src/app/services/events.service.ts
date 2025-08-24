import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { MainauEvent, NewEvent } from '../models/event';
import { ResponseMessage } from '../models/response-message';
import { EventsDB } from './events_data_db';
import { LocationDB } from './locations_data_db';
import { MockDB } from './mockdb';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  public events: MainauEvent[] = []; //only consists of id and coordinates
  public favId: number[] = [];
  public submitted = false;
  public currentEventId?: number;

  constructor() { }

  private convertEvent(): MainauEvent[] {
    let res: MainauEvent[] = []

    for (let i = 0; i < EventsDB.getInstance().events.length; i++) {
      const e = EventsDB.getInstance().events[i];


      let location;
      for (let l of LocationDB.getInstance().locations) {
        if (e.location == l.name) {
          location = l;
          break;
        }
      }

      let prices = [];

      for (let p of MockDB.getInstance().ticketcategories) {
        if (p.event_id == i + 1) {
          prices.push({ category: p.category, price: p.price })
        }
      }
      let temp: MainauEvent = {
        id: i + 1,
        title: e.title,
        start_date: e.start_date,
        end_date: e.end_date,
        whole_date: "",
        location: e.location,
        picture: e.picture,
        price: e.price,
        description: e.description,
        description_html: e.description_html,
        coordinates_lat: location?.coordinates_lat,
        coordinates_lng: location?.coordinates_lng,
        isFav: false,

        prices: prices
      }
      res.push(temp);
    }
    return res;
  }

  public getEvents(): Observable<MainauEvent[]> {
    const eventsObservable: Observable<MainauEvent[]> = //this.http.get<MainauEvent[]>('/api/events').pipe(shareReplay());
      new Observable<MainauEvent[]>(observer => {
        observer.next(this.convertEvent())
      });
    eventsObservable.subscribe({
      next: (val) => {
        this.events = val;
        this.events.forEach(event => this.processEvent(event));
      },
      error: (err) => {
        console.error(err);
      }
    });
    return eventsObservable;
  }

  public getEventById(id: number): Observable<MainauEvent> {
    const eventObservable: Observable<MainauEvent> = // this.http.get<MainauEvent>(target).pipe(shareReplay());
      new Observable<MainauEvent>(observer => {
        for (let e of this.convertEvent()) {
          if (e.id == id) {
            observer.next(e);
            break;
          }
        }
      });

    eventObservable.subscribe({
      next: (val) => {
        this.processEvent(val);
      },
      error: (err) => {
        console.error(err);
      }
    });

    return eventObservable;
  }

  public processEvent(event: MainauEvent): void {
    event.title = event.title?.split('(', 1).pop();

    //this keeps start_date and end_date in format that can be read by new Date() and thus compared
    //but creates a whole_date for display
    event.whole_date = (event.start_date === event.end_date)
      ? new Date(event.start_date).toLocaleDateString()
      : new Date(event.start_date).toLocaleDateString() + ' - ' + new Date(event.end_date).toLocaleDateString();
  }

  public addFav(eventId: number): Observable<ResponseMessage> {
    const favObservable = new Observable<ResponseMessage>(observer => {
      observer.error({ code: 500, message: "dies funktion ist im mock nicht unterschtützt" })
      observer.complete();
    }).pipe(shareReplay());
    favObservable.subscribe({
      error: (err) => {
        console.error(err);
      }
    });
    return favObservable;
  }

  public deleteFav(eventId: number): Observable<ResponseMessage> {
    const favObservable = new Observable<ResponseMessage>(observer => {
      observer.error({ code: 500, message: "dies funktion ist im mock nicht unterschtützt" })
      observer.complete();
    }).pipe(shareReplay());
    favObservable.subscribe({
      error: (err) => {
        console.error(err);
      }
    });
    return favObservable;
  }

  public getAllFav(): Observable<number[]> {
    const allFavObservable: Observable<number[]> = new Observable<number[]>(observer => {
      observer.next([3, 5])
    }).pipe(shareReplay());
    allFavObservable.subscribe({
      next: (val) => {
        this.favId = val;
      },
      error: (err) => {
        console.error(err);
      }
    });
    return allFavObservable;
  }

  public createEvent(event: NewEvent, ticketCategories: { category: string, price: number }[]): Observable<MainauEvent> {
    const eventObservable = new Observable<MainauEvent>(observer => {
      observer.error({ code: 500, message: "dies funktion ist im mock nicht unterschtützt" })
      observer.complete();
    }).pipe(shareReplay());

    eventObservable.subscribe({
      next: (val) => {
        this.currentEventId = val.id;
        this.submitted = true;
        console.log('submitted');
      },
      error: (err) => {
        console.error(err);
      }
    });
    return eventObservable;
  }

  public editEvent(event: MainauEvent, ticketCategories: { category: string, price: number }[]): Observable<MainauEvent> {
    const eventObservable = new Observable<MainauEvent>(observer => {
      observer.error({ code: 500, message: "dies funktion ist im mock nicht unterschtützt" })
      observer.complete();
    }).pipe(shareReplay());

    eventObservable.subscribe({
      next: (val) => {
        this.currentEventId = val.id;
        this.submitted = true;
        console.log('submitted');
      },
      error: (err) => {
        console.error(err);
      }
    });
    return eventObservable;
  }

  public deleteEvent(id: number): Observable<ResponseMessage> {
    const deleteObservable: Observable<ResponseMessage> = new Observable<ResponseMessage>(observer => {
      observer.error({ code: 500, message: "dies funktion ist im mock nicht unterschtützt" })
      observer.complete();
    }).pipe(shareReplay());

    deleteObservable.subscribe({
      next: (response) => {
        console.log(response.message);
      },
      error: (err) => {
        console.error(err);
      }
    });
    return deleteObservable;
  }
}
