import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Ticket } from 'src/app/models/ticket';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css', '../../../styles.css']
})
export class TicketsComponent implements OnInit {
  public tickets?: Ticket[];
  public upcomingTickets?: Ticket[];
  public expiredTickets?: Ticket[];
  public showExpired = false;

  constructor(private router: Router, private route: ActivatedRoute, protected ticketService: TicketService) { }

  ngOnInit(): void {
    this.ticketService.getTickets()
      .subscribe({
        next: tickets => {
          this.tickets = tickets;

          //tickets should appear in order of nearest end date
          this.tickets.sort((t1, t2) => {
            if (new Date(t1.end_date).getTime() < new Date(t2.end_date).getTime())
              return -1;
            else
              return 1;
          });

          //separate tickets into upcoming and expired
          const today = new Date().setHours(0, 0, 0, 0);
          this.expiredTickets = this.tickets.filter(t =>
            new Date(t.end_date).getTime() < new Date(today).getTime()
          );
          this.upcomingTickets = this.tickets.filter(t =>
            new Date(t.end_date).getTime() >= new Date(today).getTime()
          );

        },
        error: err => {
          console.error(err);
        }
      });
  }

  public showDetail(id: number): void {
    this.router.navigateByUrl('/events/' + id.toString());
  }
}
