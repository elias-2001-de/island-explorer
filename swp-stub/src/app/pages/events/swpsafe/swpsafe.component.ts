import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/events.service';
import { MainauEvent } from '../../../models/event';
import { switchMap, of } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-swpsafe',
  templateUrl: './swpsafe.component.html',
  styleUrls: ['../payment.css', '../../../../styles.css']
})
export class SWPsafeComponent implements OnInit {
  public event?: MainauEvent;
  public errorMessage: string | undefined;
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

  swpForm: FormGroup = this.fb.nonNullable.group({
    code: ['', [Validators.required]]
  }, { updateOn: 'submit' });

  errorMessages: { [key: string]: string } = {
    code: 'Dieses Feld bitte ausfüllen.'
  };

  onSubmit(): void {
    this.errorMessage = undefined;
    document.getElementById('dynamic')?.classList.add('loader');
    this.buttonDisabled = true;

    if (this.swpForm.invalid) {
      console.log('Invalid form.');
      this.swpForm.markAllAsTouched();
      document.getElementById('dynamic')?.classList.remove('loader');
      this.buttonDisabled = false;
      return;
    }
    else if (this.swpForm.valid) {
      if (this.event && this.selectedTickets) {
        const paymentData = {
          code: this.swpForm.value.code.trimEnd(),
          total: this.selectedTickets.total
        };
        const ticketData = {
          eventId: this.event.id,
          tickets: this.selectedTickets.tickets
        };

        this.pay.swpPay(paymentData, ticketData).subscribe({
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
