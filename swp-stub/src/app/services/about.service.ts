import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type NameInfo = {
  firstName: string,
  lastName: string,
  optionalAttributOne?: string
  optionalAttributTwo?: string
  optionalAttributThree?: string
}

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  // Static data that was previously returned by the backend
  private readonly nameInfoData: { [key: string]: NameInfo } = {
    'elias-maier': {
      firstName: 'Elias',
      lastName: 'Maier',
      optionalAttributOne: 'Student | 4th semester',
      optionalAttributTwo: 'B.Sc. Computer Science',
      optionalAttributThree: 'elias.2.maier@uni-konstanz.de'
    },
    'jonathan-haessler': {
      firstName: 'Jonathan',
      lastName: 'Häßler',
      optionalAttributOne: 'Student | 4th semester',
      optionalAttributTwo: 'B.Sc. Computer Science',
      optionalAttributThree: 'jonathan.haessler@uni-konstanz.de'
    },
    'nicolas-luckert': {
      firstName: 'Nicolas',
      lastName: 'Luckert',
      optionalAttributOne: 'Student | 4th semester',
      optionalAttributTwo: 'B.Sc. Computer Science',
      optionalAttributThree: 'nicolas.luckert@uni-konstanz.de'
    },
    'paulina-leutloff': {
      firstName: 'Paulina',
      lastName: 'Leutloff',
      optionalAttributOne: 'Student | 4th semester',
      optionalAttributTwo: 'B.Sc. Computer Science',
      optionalAttributThree: 'paulina.leutloff@uni-konstanz.de'
    },
    'robin-erb': {
      firstName: 'Robin',
      lastName: 'Erb',
      optionalAttributOne: 'Student | 4th semester',
      optionalAttributTwo: 'B.Sc. Computer Science',
      optionalAttributThree: 'robin.erb@uni-konstanz.de'
    },
    'lucia-schopper': {
      firstName: 'Lucia',
      lastName: 'Schopper',
      optionalAttributOne: 'Student | 4th semester',
      optionalAttributTwo: 'B.Sc. Computer Science',
      optionalAttributThree: 'lucia.schopper@uni-konstanz.de'
    }
  };

  constructor() { }

  public getNameInfo(): Observable<NameInfo> {
    // Return a default/placeholder since the original didn't specify what this should return
    return of({
      firstName: 'Default',
      lastName: 'User',
      optionalAttributOne: 'Information not available',
      optionalAttributTwo: '',
      optionalAttributThree: ''
    });
  }

  public getEliasMaierInfo(): Observable<NameInfo> {
    return of(this.nameInfoData['elias-maier']);
  }

  public getJonathanHaesslerInfo(): Observable<NameInfo> {
    return of(this.nameInfoData['jonathan-haessler']);
  }

  public getNicolasLuckertInfo(): Observable<NameInfo> {
    return of(this.nameInfoData['nicolas-luckert']);
  }

  public getPaulinaLeutloffInfo(): Observable<NameInfo> {
    return of(this.nameInfoData['paulina-leutloff']);
  }

  public getRobinErbInfo(): Observable<NameInfo> {
    return of(this.nameInfoData['robin-erb']);
  }

  public getLuciaSchopperInfo(): Observable<NameInfo> {
    return of(this.nameInfoData['lucia-schopper']);
  }

  // Optional: Helper method to get info by key
  public getPersonInfo(key: string): Observable<NameInfo | null> {
    const info = this.nameInfoData[key];
    return of(info || null);
  }

  // Optional: Get all available persons
  public getAllPersons(): Observable<NameInfo[]> {
    return of(Object.values(this.nameInfoData));
  }
}