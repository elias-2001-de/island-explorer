import { Injectable } from '@angular/core';
import { Observable, shareReplay, take } from 'rxjs';
import { ResponseMessage } from '../models/response-message';
import { User } from '../models/user';
import { MockDB } from './mockdb';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public loggedIn = false;
  public authChecked = false;
  public role = '';

  constructor() { }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public getRole(): string {
    const storedRole = localStorage.getItem('role');
    this.role = storedRole ? storedRole : '';
    return this.role;
  }

  // .pipe(shareReplay()) verhindert dass mehrere subscribe Aufrufe mehrere Request auslöst.
  public checkAuth(): Observable<boolean> {
    const authObservable: Observable<boolean> = new Observable<boolean>(observer => {
      if (localStorage.getItem("userIndex") == null) {
        observer.next(false)
      } else {
        observer.next(true)

      }
      observer.complete();
    }).pipe(shareReplay());

    authObservable.subscribe({
      next: (val) => {
        this.loggedIn = val;
        this.authChecked = true;
      },
      error: (err) => {
        this.loggedIn = false;
        console.error(err);
      }
    });
    return authObservable;
  }

  public getUser(): Observable<User> {
    const userObservable: Observable<User> = new Observable<User>(observer => {
      if (localStorage.getItem("userIndex") == null) {
        observer.error({ code: 401, message: 'Der Benutzer ist nicht angemeldet' });
      } else {

        observer.next(MockDB.getInstance().usersTable[+localStorage.getItem("userIndex")!]);
      }
    }).pipe(shareReplay());

    userObservable.subscribe({
      error: (err) => {
        this.checkAuth();
        console.error(err);
      }
    });
    return userObservable;
  }

  public login(email: string, password: string): Observable<ResponseMessage> {
    const loginObservable = new Observable<ResponseMessage>(observer => {

      let finished = false;
      for (let i = 0; i < MockDB.getInstance().usersTable.length; i++) {

        const user = MockDB.getInstance().usersTable[i]
        if (user.email == email && user.password == password) {
          finished = true;
          localStorage.setItem("userIndex", "" + i)
          observer.next({ code: 200, message: user.role || "" })
        }
      }

      if (!finished) {
        observer.error({ code: 401, message: "Ungültige Email oder falsches Passwort" })
      }
      observer.complete();
    }).pipe(shareReplay());

    loginObservable.subscribe({
      next: msg => {
        this.loggedIn = true;
        //set root as admin because frontend rights are the same
        this.role = (msg.message === 'root' ? 'admin' : msg.message); //backend sends user role in message if request ok
        localStorage.setItem('role', this.role);
      },
      error: () => {
        this.loggedIn = false;
      }
    });
    return loginObservable;
  }

  public register(user: User): Observable<ResponseMessage> {
    const registerObservable = new Observable<ResponseMessage>(observer => {
      observer.error({ code: 500, message: "dies funktion ist im mock nicht unterschtützt" })
      observer.complete();
    }).pipe(shareReplay());

    registerObservable.subscribe({
      next: msg => {
        this.loggedIn = true;
        this.role = (msg.message === 'root' ? 'admin' : msg.message); //backend sends user role in message if request ok
        localStorage.setItem('role', this.role);
      },
      error: () => {
        this.loggedIn = false;
      }
    });
    return registerObservable;
  }

  public checkPassword(password: string): Observable<boolean> {


    return new Observable<boolean>(observer => {
      if (localStorage.getItem("userIndex") == null) {
        observer.error({ code: 409, message: 'Der Benutzer ist nicht angemeldet' });
      } else {
        let user = MockDB.getInstance().usersTable[+localStorage.getItem("userIndex")!];
        observer.next(user.password == password);
      }
    }).pipe(
      take(1),
      // An Observable exists either until it has emitted all it's values (an Observable 
      // could also emit a data stream, hence 'all values') or until it encounters an error.
      // take(1) deotes that the Observable should send the complete() callback once it has emitted one value.
      shareReplay()
      // Share replay caches the Observables data and hence keeps the Observable alive so that multiple subscribers can access it.
      // This however means that the Observable never completes. This is why take(1) must be used.
    );
  }

  public updateUser(user: User): Observable<ResponseMessage> {
    const updateObservable = new Observable<ResponseMessage>(observer => {
      observer.error({ code: 500, message: "dies funktion ist im mock nicht unterschtützt" })
      observer.complete();
    }).pipe(shareReplay());
    updateObservable.subscribe({
      error: (err) => {
        this.checkAuth();
        console.error(err);
      }
    });
    return updateObservable;
  }

  public logout(): Observable<ResponseMessage> {
    const logoutObservable: Observable<ResponseMessage> = new Observable<ResponseMessage>(observer => {
      if (localStorage.getItem("userIndex") == null) {
        observer.error({ code: 409, message: 'Der Benutzer ist nicht angemeldet' });
      } else {
        observer.next({ code: 200, message: 'Logout successful' })
        localStorage.removeItem("userIndex")
      }
    }).pipe(shareReplay());
    logoutObservable.subscribe({
      next: () => {
        this.loggedIn = false;
        this.role = '';
        localStorage.removeItem('role');
      },
      error: (err) => {
        this.checkAuth();
        console.error(err);
      }
    });
    return logoutObservable;
  }
}

