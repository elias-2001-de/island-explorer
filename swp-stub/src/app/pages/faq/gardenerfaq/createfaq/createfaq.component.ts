import { Component } from '@angular/core';
import { FaqService } from 'src/app/services/faq.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  templateUrl: './createfaq.component.html',
  styleUrls: ['../../faq.css']
})
export class CreatefaqComponent {

  public submitted = false;

  constructor(private router: Router, private faqService: FaqService, private fb: FormBuilder) { }

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
      if (this.addQuestionForm.value.question !== undefined &&
        this.addQuestionForm.value.answer !== undefined) {

        const question = this.addQuestionForm.value.question.trimEnd();
        const answer = this.addQuestionForm.value.answer.trimEnd();

        this.faqService.createFaq(question, answer).subscribe({
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
