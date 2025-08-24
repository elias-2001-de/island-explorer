import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent {

  @Input()
  label = '';

  @Input()
  text = '';

  @Input()
  options: string[] = [];

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

  getSelectClass(): { [key: string]: boolean } {
    return {
      //'input-box-focused': this.isInputFocused(),
      'select-invalid': this.isInvalid()
    };
  }
}


