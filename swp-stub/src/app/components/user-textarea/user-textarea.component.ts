import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlContainer, FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-textarea',
  templateUrl: './user-textarea.component.html',
  styleUrls: ['./user-textarea.component.css', '../user-input/user-input.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  encapsulation: ViewEncapsulation.None
})
export class UserTextareaComponent implements OnInit {

  ngOnInit(): void {
    // Before, the first button in the form was triggered when pressing enter, causing the first form field to be cleared.
    // This is the default form behavior and shall be prevented from now on.
    //const form = document.querySelector('form');
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        //form?.dispatchEvent(new Event('submit'));      
      }
    });
  }

  @Input()
  heightPx?: Number;

  @Input()
  label = '';

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
      'input-box-invalid': this.isInvalid()
    };
  }
}



