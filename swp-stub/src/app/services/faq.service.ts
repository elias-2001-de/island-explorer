import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { faq } from '../models/faq';
import { ResponseMessage } from '../models/response-message';
import { MockDB } from './mockdb';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  constructor(private http: HttpClient) { }

  public getFaqs(): Observable<faq[]> {
    const faqObservable: Observable<faq[]> = new Observable<faq[]>(observer => {
      observer.next(MockDB.getInstance().faqs)
      observer.complete();
    }).pipe(shareReplay());
    return faqObservable;
  }

  public deletFaq(faqId: number): Observable<ResponseMessage> {
    const faqObservable: Observable<ResponseMessage> = new Observable<ResponseMessage>(observer => {
      observer.error({ code: 500, message: "dies funktion ist im mock nicht unterschtützt" })
      observer.complete();
    }).pipe(shareReplay());
    return faqObservable;
  }

  public createFaq(question: String, answer: String): Observable<ResponseMessage> {
    const faqObservable: Observable<ResponseMessage> = new Observable<ResponseMessage>(observer => {
      observer.error({ code: 500, message: "dies funktion ist im mock nicht unterschtützt" })
      observer.complete();
    }).pipe(shareReplay());
    return faqObservable;
  }

  public updateFaq(faq: faq): Observable<ResponseMessage> {
    const faqObservable: Observable<ResponseMessage> = new Observable<ResponseMessage>(observer => {
      observer.error({ code: 500, message: "dies funktion ist im mock nicht unterschtützt" })
      observer.complete();
    }).pipe(shareReplay());
    return faqObservable;
  }

}
