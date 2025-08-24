import { Component, OnInit } from '@angular/core';
import { FaqService } from 'src/app/services/faq.service';
import { faq } from 'src/app/models/faq';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './editfaq.component.html',
  styleUrls: ['../../faq.css']
})
export class EditfaqComponent implements OnInit {

  public faq?: faq;
  public submitted = false;

  constructor(private router: Router, private route: ActivatedRoute, private faqService: FaqService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: params => {
        const id = params.get('id');

        if (id) {
          this.faqService.getFaqs()
            .subscribe({
              next: faqs => {
                this.faq = faqs.find(e => e.id.toString() === id);

                this.addQuestionForm.setValue({
                  question: this.faq?.question,
                  answer: this.faq?.answer
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

  addQuestionForm: FormGroup = this.fb.nonNullable.group({
    question: ['', [Validators.required, Validators.maxLength(250)]],
    answer: ['', [Validators.required]]
  }, { updateOn: 'change' });

  errorMessages: { [key: string]: string } = {
    question: 'Mehr als 250 Zeichen ist zu lang fürs FAQ.',
    answer: ''
  };

  onSubmit(): void {
    this.submitted = true;
    if (this.addQuestionForm.invalid) {
      console.log('Invalid form.');
      this.addQuestionForm.markAllAsTouched();
      this.submitted = false;
      return;
    }
    else if (this.addQuestionForm.valid) {
      if (this.faq && this.addQuestionForm.value.question !== undefined &&
        this.addQuestionForm.value.answer !== undefined) {

        this.faq.question = this.addQuestionForm.value.question.trimEnd();
        this.faq.answer = this.addQuestionForm.value.answer.trimEnd();

        this.faqService.updateFaq(this.faq).subscribe({
          next: () => {
            this.router.navigateByUrl('gardenerfaq');
          },
          error: (err) => {
            console.error(err);
            this.submitted = false;
          }
        });
      }
    }
  }

  abbrechen(): void {
    this.router.navigateByUrl('gardenerfaq');
  }
}
