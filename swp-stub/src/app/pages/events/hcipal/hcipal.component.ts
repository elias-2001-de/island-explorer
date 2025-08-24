import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/events.service';
import { MainauEvent } from '../../../models/event';
import { switchMap, of } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-hcipal',
  templateUrl: './hcipal.component.html',
  styleUrls: ['../payment.css', '../../../../styles.css']
})
export class HCIpalComponent implements OnInit {
  public event?: MainauEvent;
  public errorMessage?= '';
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

  hciPalForm: FormGroup = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  }, { updateOn: 'submit' });

  public errorMessages: { [key: string]: string } = {
    email: 'E-Mail Adresse muss dem geläufigen E-Mail-Format genügen.',
    password: 'Das Passwort ist nicht korrekt.'
  };

  onSubmit(): void {
    this.errorMessage = undefined;
    document.getElementById('dynamic')?.classList.add('loader');
    this.buttonDisabled = true; // Disable buttons while info is being processed.

    if (this.hciPalForm.invalid) {
      console.log('Invalid form.');
      this.hciPalForm.markAllAsTouched();
      document.getElementById('dynamic')?.classList.remove('loader');
      this.buttonDisabled = false;
      return;
    }

    else if (this.hciPalForm.valid) {
      if (this.event && this.selectedTickets) {
        const paymentData = {
          email: this.hciPalForm.value.email.trimEnd(),
          password: this.hciPalForm.value.password.trimEnd(),
          total: this.selectedTickets.total
        };
        const ticketData = {
          eventId: this.event.id,
          tickets: this.selectedTickets.tickets
        };
        this.pay.hciPay(paymentData, ticketData).subscribe({
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

