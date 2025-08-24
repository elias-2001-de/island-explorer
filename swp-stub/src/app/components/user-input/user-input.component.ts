import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlContainer, FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class UserInputComponent implements OnInit {

  ngOnInit(): void {

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    });
  }


  @Input()
  label = '';

  @Input()
  type: 'text' | 'file' | 'date' | 'number' | 'password' = 'text';

  @Input()
  accept = '';

  @Input()
  text = '';
  @Output()
  textChange = new EventEmitter<string>();

  onTextChange(): void {
    this.textChange.emit(this.text);
  }

  @Input()
  errorMessage = 'Dieses Feld bitte ausfüllen.';

  @Input()
  myForm!: FormGroup;

  @Input()
  formFieldName!: string;

  @Output()
  resetFormFieldValue(event: Event): void {
    event.preventDefault(); // For some mad reason, it is the default for input elements to submit a form upon click. This has to end!
    this.myForm.patchValue({ [this.formFieldName]: '' });
  }

  /* This method is only for the purpose of selecting between styles and showing the correct error message.
     A field is invalid if it is invalid (no shit sherlock) but the invalid style should only be applied 
     once the user has interacted with the input field. */
  isInvalid(): boolean {
    const formField = this.myForm.get(this.formFieldName);

    if (formField) {
      if (formField.invalid && (formField.touched || formField.dirty || formField.value !== '')) {
        return true;
      }
    }

    return false;
  }

  @ViewChild
    ('inputField', { static: true }) inputField!: ElementRef<HTMLInputElement>;

  isInputFocused(): boolean {
    return this.inputField.nativeElement === document.activeElement;
  }

  getInputBoxClass(): { [key: string]: boolean } {
    return {
      //'input-box-focused': this.isInputFocused(),
      'input-box-invalid': this.isInvalid()
    };
  }
}


