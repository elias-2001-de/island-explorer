import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Location } from '../models/location';
import { LocationDB } from './locations_data_db';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  public locations: Location[] = []; //only consists of id and coordinates

  constructor() { }

  public getLocations(): Observable<Location[]> {
    const locationsObservable: Observable<Location[]> = // this.http.get<Location[]>('/api/locations').pipe(shareReplay());
      new Observable<Location[]>(observer => {
        observer.next(LocationDB.getInstance().locations);
      });
    locationsObservable.subscribe({
      next: (val) => {
        this.locations = val;
      },
      error: (err) => {
        console.error(err);
      }
    });
    return locationsObservable;
  }

  public getLocationById(id: number): Observable<Location> {
    const locationObservable: Observable<Location> = // this.http.get<Location>(target);

      new Observable<Location>(observer => {
        for (let l of LocationDB.getInstance().locations) {
          if (l.id == id) {
            observer.next(l);
            break;
          }
        }
      }).pipe(shareReplay());

    return locationObservable;
  }

}
