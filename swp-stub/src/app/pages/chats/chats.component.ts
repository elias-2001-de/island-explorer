import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { Conversation } from 'src/app/models/conversation';
import { LoginService } from 'src/app/services/login.service';

@Component({
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css', './chat.css', '../../../styles.css']
})
export class ChatsComponent implements OnInit {

  public chats?: Conversation[];
  public role = '';
  public openLen = 0;

  constructor(private router: Router, private chatService: ChatService, private fb: FormBuilder, private loginService: LoginService) { }

  ngOnInit(): void {
    this.role = this.loginService.getRole();

    if (this.role === 'gardener') {
      this.chatService.getOpenConversations().subscribe({
        next: openChats => {
          this.openLen = openChats.length;
        }, error: err => {
          console.error(err);
        }
      });
    }

    this.chatService.getConversations()
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
          this.chats = chats;
        },
        error: err => {
          console.error(err);
        }
      });
  }
}
