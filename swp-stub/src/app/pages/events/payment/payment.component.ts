import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/events.service';
import { MainauEvent } from '../../../models/event';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css', '../../../../styles.css']
})
export class PaymentComponent implements OnInit {
  public event?: MainauEvent;
  public totalPrice = 0;
  public selectedTickets: Map<string, number> = new Map();
  public numTickets = 0;

  constructor(private router: Router, private route: ActivatedRoute, protected eventsService: EventService) { }

  ngOnInit(): void {
    //get which event to display from route
    this.route.paramMap.pipe(
      switchMap((params) => of(params.get('id'))),
      switchMap((id) =>
        //guaranteed to be not null, because component has id param
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.eventsService.getEventById(parseInt(id!)))
    )
      .subscribe({
        next: ev => {
          this.event = ev;
        },
        error: err => {
          console.error(err);
        }
      });
  }

  decreaseAmount(cat: { category: string, price: number }): void {
    const input = document.getElementById(cat.category) as HTMLInputElement;
    const dec = document.getElementById(cat.category + 'd') as HTMLInputElement;
    const inc = document.getElementById(cat.category + 'i') as HTMLInputElement;
    let nr = +input.value;
    if (nr !== 0) {
      if (nr === 99) {
        inc.classList.remove('unavailable');
        inc.removeAttribute('disabled');
      }
      nr = nr - 1;
      input.value = nr.toString();
      this.totalPrice = this.totalPrice - (+cat.price);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.selectedTickets.set(cat.category, this.selectedTickets.get(cat.category)! + 1);
      this.numTickets--;
    }
    if (nr === 0) {
      dec.classList.add('unavailable');
      dec.setAttribute('disabled', '');
      this.selectedTickets.delete(cat.category);
    }

  }

  // Gets called on click on the html element with this.event?.prices as argument.
  increaseAmount(cat: { category: string, price: number }): void {
    const input = document.getElementById(cat.category) as HTMLInputElement;
    const dec = document.getElementById(cat.category + 'd') as HTMLInputElement;
    const inc = document.getElementById(cat.category + 'i') as HTMLInputElement;
    let nr = +input.value;
    if (nr === 0) {
      dec.classList.remove('unavailable');
      dec.removeAttribute('disabled');
      this.selectedTickets.set(cat.category, 0);
    }if (input) {
      nr= nr + 1;
      if(nr=== 99){
        inc.classList.add('unavailable');
        inc.setAttribute('disabled', '');
      }
      input.value = (nr).toString();
      this.totalPrice = this.totalPrice + (+cat.price);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.selectedTickets.set(cat.category, this.selectedTickets.get(cat.category)! + 1);
      this.numTickets++;
    }
  }

  public proceedToPayment(provider: string): void {

    const ticketPrices: Map<string, number> = new Map<string, number>();
    this.event?.prices?.forEach(p => ticketPrices.set(p.category, p.price));

    const selected = Array.from(this.selectedTickets, entry => {
      return {
        category: entry[0],
        price: ticketPrices.get(entry[0]),
        amount: entry[1],
      };
    });

    const passData = { tickets: selected, total: this.totalPrice };

    this.router.navigate([provider], { relativeTo: this.route, state: { data: passData } });
  }
}
