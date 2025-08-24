import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ResponseMessage } from '../models/response-message';

type SWPData = {
  code: string,
  total: number
}

type HCIData = {
  email: string,
  password: string,
  total: number
}

type BachelorData = {
  cardNumber: string,
  name: string,
  securityCode: string,
  expirationDate: string,
  total: number
}

type TicketData = {
  eventId: number,
  tickets: { category: string, amount: number }[]
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor() { }

  public swpPay(paymentData: SWPData, ticketData: TicketData): Observable<ResponseMessage> {
    const payObservable = new Observable<ResponseMessage>(observer => {
      observer.error({ code: 500, message: "dies funktion ist im mock nicht unterschtützt" })
      observer.complete();
    }).pipe(shareReplay());
    return payObservable;
  }

  public hciPay(paymentData: HCIData, ticketData: TicketData): Observable<ResponseMessage> {
    const payObservable = new Observable<ResponseMessage>(observer => {
      observer.error({ code: 500, message: "dies funktion ist im mock nicht unterschtützt" })
      observer.complete();
    }).pipe(shareReplay());
    return payObservable;
  }

  public bachelorPay(paymentData: BachelorData, ticketData: TicketData): Observable<ResponseMessage> {
    const payObservable = new Observable<ResponseMessage>(observer => {
      observer.error({ code: 500, message: "dies funktion ist im mock nicht unterschtützt" })
      observer.complete();
    }).pipe(shareReplay());
    return payObservable;
  }
}
