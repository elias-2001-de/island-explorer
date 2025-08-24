import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Ticket } from '../models/ticket';
import { MockDB } from './mockdb';
import { EventsDB } from './events_data_db';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  public tickets: Ticket[] = [];

  constructor() { }

  public getTickets(): Observable<Ticket[]> {
    const ticketObservable: Observable<Ticket[]> = //  this.http.get<Ticket[]>('/api/tickets').pipe(shareReplay());

      new Observable<Ticket[]>(observer => {
        let user = MockDB.getInstance().usersTable[+ localStorage.getItem("userIndex")!];

        let res: Ticket[] = []


        for (let t of MockDB.getInstance().tickets) {
          if (t.email != user.email) {
            continue;
          }

          let found = false;
          for (let r of res) {
            if (r.event_id == t.event_id) {
              found = true;
              r.amounts.push({ category: t.category, amount: t.amount });
              break;
            }
          }
          if (!found) {
            let e = EventsDB.getInstance().events[t.event_id + 1];

            let temp: Ticket = {
              event_id: t.event_id,
              title: e.title,
              picture: e.picture,
              start_date: e.start_date,
              end_date: e.end_date,
              whole_date: "",
              amounts: [{
                category: t.category,
                amount: t.amount,
              }]
            }
            res.push(temp);

          }
        }

        observer.next(res)
      }).pipe(shareReplay());

    ticketObservable.subscribe({
      next: (val) => {
        this.tickets = val;
        this.tickets.forEach(ticket => this.processTicket(ticket));
      },
      error: (err) => {
        console.error(err);
      }
    });
    return ticketObservable;
  }

  public processTicket(ticket: Ticket): void {
    ticket.title = ticket.title?.split('(', 1).pop();

    //this keeps start_date and end_date in format that can be read by new Date() and thus compared
    //but creates a whole_date for display
    ticket.whole_date = (ticket.start_date === ticket.end_date)
      ? new Date(ticket.start_date).toLocaleDateString()
      : new Date(ticket.start_date).toLocaleDateString() + ' - ' + new Date(ticket.end_date).toLocaleDateString();
  }

}
