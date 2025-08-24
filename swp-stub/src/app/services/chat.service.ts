import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ResponseMessage } from '../models/response-message';
import { Message } from '../models/messages';
import { Conversation } from '../models/conversation';
import { MockDB } from './mockdb';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  public createChat(topic: string, msg: string, type: string): Observable<ResponseMessage[]> {
    const responseObservable: Observable<ResponseMessage[]> = new Observable<ResponseMessage[]>(observer => {
      observer.error({ code: 500, message: "dies funktion ist im mock nicht unterschtützt" })
      observer.complete();
    }).pipe(shareReplay());
    return responseObservable;
  }

  public sendMessage(conversationId: number, msg: string): Observable<ResponseMessage[]> {
    const responseObservable: Observable<ResponseMessage[]> = new Observable<ResponseMessage[]>(observer => {
      observer.error({ code: 500, message: "dies funktion ist im mock nicht unterschtützt" })
      observer.complete();
    }).pipe(shareReplay());
    return responseObservable;
  }

  public getConversations(): Observable<Conversation[]> {
    const conversationObservable: Observable<Conversation[]> = //this.http.get<Conversation[]>('/api/chat/conversations').pipe(shareReplay());
      new Observable<Conversation[]>(observer => {
        let user = MockDB.getInstance().usersTable[+ localStorage.getItem("userIndex")!];

        let res: Conversation[] = [];
        for (let c of MockDB.getInstance().conversations) {

          if (user.role == "visitor" && user.email == c.user_email) {
            let cc: Conversation = {
              id: c.id,
              topic: c.topic,
              type: c.type,
              isOpen: !c.user_read,
            }

            res.push(cc);
          } else if (user.role == "gardener" && user.email == c.gardener_email) {
            let cc: Conversation = {
              id: c.id,
              topic: c.topic,
              type: c.type,
              isOpen: !c.gardener_read,
            }

            res.push(cc);
          }

        }

        observer.next(res);
      }).pipe(shareReplay());
    return conversationObservable;
  }

  public getConversation(convId: number): Observable<Message[]> {
    const messagesObservable: Observable<Message[]> = // this.http.get<Message[]>(`/api/chat/conversation/${convId}`).pipe(shareReplay());
      new Observable<Message[]>(observer => {
        let user = MockDB.getInstance().usersTable[+ localStorage.getItem("userIndex")!];

        let res: Message[] = []
        for (let m of MockDB.getInstance().messages) {
          if (m.conversation == convId) {
            let temp: Message = {
              conversation: m.conversation,
              isSelf: m.email == user.email,
              msg: m.msg,
              createdAt: m.created_at,
            }
            res.push(temp);
          }
        }
        observer.next(res);
      }).pipe(shareReplay());
    return messagesObservable;
  }

  public getOpenConversations(): Observable<Conversation[]> {
    const conversationObservable: Observable<Conversation[]> = new Observable<Conversation[]>(observer => {
      let openConv: Conversation[] = []
      for (const conv of MockDB.getInstance().conversations) {
        if (!conv.gardener_email) {
          openConv.push({
            id: conv.id,
            topic: conv.topic,
            type: conv.type,
            isOpen: true
          });
        }
      }
      observer.next(openConv);
    }).pipe(shareReplay());


    //this.http.get<Conversation[]>('/api/chat/open-conversations').pipe(shareReplay());
    return conversationObservable;
  }

  public getOpenUserConversations(): Observable<number[]> {
    const conversationObservable: Observable<number[]> = //this.http.get<number[]>('/api/chat/open-user-conversations').pipe(shareReplay());
      new Observable<number[]>(observer => {
        let user = MockDB.getInstance().usersTable[+ localStorage.getItem("userIndex")!];


        let res: number[] = [];
        for (let c of MockDB.getInstance().conversations) {

          if (user.role == "visitor" && user.email == c.user_email) {

            if (!c.user_read) {
              res.push(c.id);
            }
          } else if (user.role == "gardener" && user.email == c.gardener_email) {
            if (!c.gardener_read) {
              res.push(c.id);
            }
          }

        }

        observer.next(res);

      }).pipe(shareReplay());
    return conversationObservable;
  }
}
