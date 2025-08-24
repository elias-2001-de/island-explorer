
import { Component, OnInit } from '@angular/core';
import { FaqService } from 'src/app/services/faq.service';
import { faq } from 'src/app/models/faq';

@Component({
  templateUrl: './gardenerfaq.component.html',
  styleUrls: ['../faq.css']
})
export class GardenerfaqComponent implements OnInit {

  public faqs: faq[] = [];
  constructor(private faqService: FaqService) { }

  ngOnInit(): void {
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

  public deletQuestion(faqId: number): void {

    this.faqService.deletFaq(faqId)
      .subscribe({
        next: () => {
          this.ngOnInit();
        },
        error: err => {
          console.error(err);
        }
      });
  }
}
