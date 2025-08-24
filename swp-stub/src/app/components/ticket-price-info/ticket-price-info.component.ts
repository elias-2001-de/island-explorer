import { Component, Input } from '@angular/core';
import { MainauEvent } from '../../models/event';

@Component({
  selector: 'app-ticket-price-info',
  templateUrl: './ticket-price-info.component.html',
  styleUrls: ['./ticket-price-info.component.css']
})
export class TicketPriceInfoComponent {
  @Input()
  public selectedTickets?: { tickets: { category: string, price: number, amount: number }[], total: number };

  @Input()
  event!: MainauEvent;
}
