import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  templateUrl: './userquestion.component.html',
  styleUrls: ['../../../../../styles.css', '../../faq.css']
})
export class UserquestionComponent {

  constructor(private router: Router, private chatService: ChatService, private fb: FormBuilder) { }

  public type: string[] = ['Rosen', 'Bäume', 'Zimmerpflanzen', 'Orchideen', 'Schädlingsbekämpfung', 'Sonstiges'];

  addQuestionForm: FormGroup = this.fb.nonNullable.group({
    topic: ['', [Validators.required, Validators.pattern('.{1,64}')]],
    question: ['', [Validators.required]],
    type: ['', [Validators.required]]
  }, { updateOn: 'change' });

  errorMessages: { [key: string]: string } = {
    topic: 'Maximal 64 Zeichen',
    question: '',
    type: ''
  };

  onSubmit(): void {
    if (this.addQuestionForm.invalid) {
      console.log('Invalid form.');
      this.addQuestionForm.markAllAsTouched();
      return;
    } else if (this.addQuestionForm.valid) {
      if (this.addQuestionForm.value.question !== undefined &&
        this.addQuestionForm.value.topic !== undefined &&
        this.addQuestionForm.value.type !== undefined) {

        const topic = this.addQuestionForm.value.topic.trimEnd();
        const question = this.addQuestionForm.value.question.trimEnd();
        const type = this.addQuestionForm.value.type.trimEnd();

        this.chatService.createChat(topic, question, type).subscribe({
          next: () => {
            this.router.navigateByUrl('userfaq');
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    }
  }

  abbrechen(): void {
    this.router.navigateByUrl('userfaq');
  }
}

