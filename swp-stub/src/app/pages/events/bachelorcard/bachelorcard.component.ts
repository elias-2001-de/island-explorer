import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/events.service';
import { MainauEvent } from '../../../models/event';
import { switchMap, of } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-bachelorcard',
  templateUrl: './bachelorcard.component.html',
  styleUrls: ['../../../../styles.css', '../payment.css']
})
export class BachelorcardComponent implements OnInit {
  public event?: MainauEvent;
  public errorMessage: string | undefined = undefined;
  public buttonDisabled = false;
  public selectedTickets?: { tickets: { category: string, price: number, amount: number }[], total: number };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    protected eventsService: EventService,
    private loginService: LoginService,
    private fb: FormBuilder,
    private pay: PaymentService
  ) { }

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

    this.selectedTickets = history.state.data;
  }

  bachelorCardForm: FormGroup = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9äöüÄÖÜß -]*\s*')]],
    cardNumber: ['', [Validators.required, Validators.pattern('([0-9]{4}-){3}[0-9]{4}\s*')]],
    securityCode: ['', [Validators.required, Validators.pattern('[0-9]{3}\s*')]],
    expirationDate: ['', [Validators.required, Validators.pattern('((10|11|12)|[1-9])\/[0-9]{2}\s*')]]
  }, { updateOn: 'change' });

  errorMessages: { [key: string]: string } = {
    name: 'Kein gültiger Name.',
    cardNumber: 'Kartennummer muss dem Format xxxx-xxxx-xxxx-xxxx entsprechen.',
    securityCode: 'Sicherheitsnummer muss aus drei Ziffern bestehen.',
    expirationDate: 'Datum muss dem Format MM/YY entsprechen.'
  };

  onSubmit(): void {
    this.errorMessage = undefined;
    document.getElementById('dynamic')?.classList.add('loader');
    this.buttonDisabled = true; // Disable buttons while info is being processed.

    if (this.bachelorCardForm.invalid) {
      console.log('Invalid form.');
      this.bachelorCardForm.markAllAsTouched();
      document.getElementById('dynamic')?.classList.remove('loader');
      this.buttonDisabled = false;
      return;
    }
    else if (this.bachelorCardForm.valid) {
      if (this.event && this.selectedTickets) {
        const paymentData = {
          cardNumber: this.bachelorCardForm.value.cardNumber.trimEnd(),
          name: this.bachelorCardForm.value.name.trimEnd(),
          securityCode: this.bachelorCardForm.value.securityCode.trimEnd(),
          expirationDate: this.bachelorCardForm.value.expirationDate.trimEnd(),
          total: this.selectedTickets.total
        };
        const ticketData = {
          eventId: this.event.id,
          tickets: this.selectedTickets.tickets
        };

        this.pay.bachelorPay(paymentData, ticketData).subscribe({
          next: () => {
            this.errorMessage = undefined;
            this.router.navigateByUrl('/events/' + this.event?.id.toString() + '/payment' + '/success');
          },
          error: (err) => {
            console.error(err.error.message);
            document.getElementById('dynamic')?.classList.remove('loader');
            this.errorMessage = err.error.message;
            this.buttonDisabled = false;
          }
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['events']);
  }
}
