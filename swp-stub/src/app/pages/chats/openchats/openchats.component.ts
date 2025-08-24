import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { ChatService } from 'src/app/services/chat.service';
import { Conversation } from 'src/app/models/conversation';

@Component({
  templateUrl: './openchats.component.html',
  styleUrls: ['../../../../styles.css', './../chat.css']
})
export class OpenchatsComponent implements OnInit {

  public chats?: Conversation[];
  public allChats?: Conversation[];
  public categories: string[] = ['Alle', 'Rosen', 'Bäume', 'Zimmerpflanzen', 'Orchideen', 'Schädlingsbekämpfung', 'Sonstiges'];

  constructor(private router: Router, private chatService: ChatService, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.chatService.getOpenConversations()
      .subscribe({
        next: chats => {
          this.chatService.getOpenUserConversations().subscribe({
            next: openChats => {
              openChats.forEach(id => {
                const chat = chats.find(e => e.id === id);
                if (chat) {
                  chat.isOpen = true;
                }
              });
            },
            error: err => {
              console.error(err);
            }
          });
          this.allChats = chats;
          this.chats = chats;


        },
        error: err => {
          console.error(err);
        }
      });
  }

  public filter(): void {
    const element = (<HTMLInputElement>document.getElementById('categories-select')).value;
    if (element) {
      if (this.allChats) {
        this.chats = [];
        for (let i = 0; i < this.allChats.length; i++) {
          if (element === this.allChats[i].type) {
            this.chats.push(this.allChats[i]);
          }
        }
      }
    } else {
      this.chats = this.allChats;
    }
  }
}
