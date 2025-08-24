import { Component, OnInit } from '@angular/core';
import { FaqService } from 'src/app/services/faq.service';
import { ChatService } from 'src/app/services/chat.service';
import { faq } from 'src/app/models/faq';

@Component({
  templateUrl: './userfaq.component.html',
  styleUrls: ['../faq.css', '../../../../styles.css']
})
export class UserfaqComponent implements OnInit {

  public faqs: faq[] = [];
  public openLen = 0;
  constructor(private faqService: FaqService, private chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.getOpenUserConversations().subscribe({
      next: openChats => {
        this.openLen = openChats.length;
      }, error: err => {
        console.error(err);
      }
    });

    this.faqService.getFaqs()
      .subscribe({
        next: faqs => {
          this.faqs = faqs;
        },
        error: err => {
          console.error(err);
        }
      });
  }
}
