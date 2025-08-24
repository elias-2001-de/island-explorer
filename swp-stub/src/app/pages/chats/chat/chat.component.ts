import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Message } from 'src/app/models/messages';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';


@Component({
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css', '../../../../styles.css']
})
export class ChatComponent implements OnInit {
  public messages?: Message[];
  public id?: number;
  public role = '';
  private timeOffset = new Date().getTimezoneOffset() * (-60 * 1000); //offset from UTC according to current browser time converted to milliseconds and inverted so that addding offset results in correct local time
  private timeFormatOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }; //options for formatting the date

  constructor(private router: Router, private chatService: ChatService, private fb: FormBuilder, private route: ActivatedRoute, private loginService: LoginService,) { }

  ngOnInit(): void {

    this.role = this.loginService.getRole();

    this.route.paramMap.subscribe({
      next: params => {
        const id = params.get('id');
        if (id) {
          this.id = parseInt(id);
          this.chatService.getConversation(parseInt(id))
            .subscribe({
              next: messages => {
                this.messages = messages;
                this.messages.forEach(m => {
                  m.createdAt = new Date(new Date(m.createdAt).getTime() + this.timeOffset).toLocaleString(undefined, this.timeFormatOptions);
                });

              },
              error: err => {
                console.error(err);
              }
            });

        }
      },
      error: err => {
        console.error(err);
      }
    });


  }

  addChatForm: FormGroup = this.fb.nonNullable.group({
    answer: ['']
  }, { updateOn: 'change' });

  errorMessages: { [key: string]: string } = {
    answer: ''
  };

  keyDownFunction(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      this.onSubmit();
    }
  }

  onSubmit(): void {

    if (this.addChatForm.invalid) {
      this.addChatForm.markAllAsTouched();
      return;
    }
    else if (this.addChatForm.valid) {

      if (this.addChatForm.value.answer !== undefined) {

        const answer = this.addChatForm.value.answer.trimEnd();

        if (answer === '') {
          return;
        }

        else if (this.id)
          this.chatService.sendMessage(this.id, answer).subscribe({
            next: () => {
              this.ngOnInit();
            },
            error: (err) => {
              console.error(err);
            }
          });
      }
    }
    this.addChatForm.setValue({ answer: '' });
  }
}