import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { User } from '../models/user';
import { ResponseMessage } from '../models/response-message';
import { MockDB } from './mockdb';

@Injectable({
  providedIn: 'root'
})
export class AdminrolesService {

  public adminroles: User[] = [];

  constructor() { }

  public getAdminroles(): Observable<User[]> {
    const adminrolesObservable: Observable<User[]> = new Observable<User[]>(observer => {

      if (localStorage.getItem("userIndex") == null) {
        observer.error({ code: 401, message: 'Der Benutzer ist nicht angemeldet' });
      } else {

        let thisUserId = +localStorage.getItem("userIndex")!;
        let res = [];
        for (let i = 0; i < MockDB.getInstance().usersTable.length; i++) {
          if (i == thisUserId) {
            continue;
          }
          const user = MockDB.getInstance().usersTable[i];
          if (user.role == "admin" || user.role == "gardener") {
            res.push(user);
          }
        }
        observer.next(res);
      }

    }).pipe(shareReplay());
    adminrolesObservable.subscribe({
      next: (val) => {
        this.adminroles = val;
      },
      error: (err) => {
        console.error(err);
      }
    });
    return adminrolesObservable;
  }

  public deleteStaff(email: string): Observable<ResponseMessage> {
    const deleteObservable: Observable<ResponseMessage> = new Observable<ResponseMessage>(observer => {
      observer.error({ code: 500, message: "dies funktion ist im mock nicht unterschtützt" })
      observer.complete();
    }).pipe(shareReplay());
    deleteObservable.subscribe({
      error: (err) => {
        console.error(err);
      }
    });
    return deleteObservable;
  }

  public createStaff(user: User): Observable<ResponseMessage> {
    const createStaffObservable = new Observable<ResponseMessage>(observer => {
      observer.error({ code: 500, message: "dies funktion ist im mock nicht unterschtützt" })
      observer.complete();
    }).pipe(shareReplay());

    createStaffObservable.subscribe({
      error: (err) => {
        console.error(err);
      }
    });
    return createStaffObservable;
  }
}
