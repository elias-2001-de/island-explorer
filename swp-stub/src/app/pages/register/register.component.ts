import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../../styles.css']
})

export class RegisterComponent implements OnInit {

  public submitted = false;

  constructor(private router: Router, private loginService: LoginService, private fb: FormBuilder) { }

  registerForm = this.fb.nonNullable.group({
    firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9äöüÄÖÜß -]*\s*')]],
    lastname: ['', [Validators.required, Validators.pattern('[a-zA-ZäöüÄÖÜß -]*\s*')]],
    street: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9äöüÄÖÜß -]*\s*')]],
    house_no: ['', [Validators.required, Validators.pattern('[0-9]+[a-zA-Z0-9äöüÄÖÜß]*\s*')]],
    postcode: ['', [Validators.required, Validators.pattern('[0-9]{5}\s*')]],
    city: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordRep: ['', [Validators.required]],
  }, { updateOn: 'change' });

  passwordRepValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value !== this.registerForm.get('password')?.value || control.value === '') {
        return { 'PasswordsDoNotMatch': true };
      }
      return null;
    };
  }

  public errorMessage: string | undefined = undefined;

  errorMessages: { [key: string]: string } = {
    firstname: 'Kein gültiger Vorname.',
    lastname: 'Kein gültiger Nachname.',
    street: 'Keine gültige Straße.',
    house_no: 'Muss mit einer Zahl beginnen.',
    postcode: 'Postleitzahl muss aus genau 5 Zahlen bestehen.',
    city: 'Keine gültige Stadt.',
    email: 'Die E-Mail muss dem geläufigen E-Mail-Format genügen.',
    password: 'Passwort muss aus mindestens 8 Symbolen bestehen.',
    passwordRep: 'Die Passwörter müssen übereinstimmen.'
  };

  ngOnInit(): void {
    /*this.errorMessages = Object.keys(this.registerForm.value).reduce((messages: {[key: string]: string | undefined;}, key) => {
      messages[key] = undefined;
      return messages;
    }, {});*/
    this.registerForm.get('passwordRep')?.setValidators(this.passwordRepValidator());
  }

  keyDownFunction(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    //console.log('Error Messages:', this.errorMessages);
    //console.log('Here we gooo: ', this.registerForm.value);
    this.submitted = true;

    if (this.registerForm.invalid) {
      console.log('INVALID');
      this.registerForm.markAllAsTouched();
      //this.registerForm.setErrors({ ...this.registerForm.errors });
      this.submitted = false;
      return;
    }
    else if (this.registerForm.valid) {
      if (this.registerForm.value.firstname !== undefined &&
        this.registerForm.value.lastname !== undefined &&
        this.registerForm.value.street !== undefined &&
        this.registerForm.value.house_no !== undefined &&
        this.registerForm.value.postcode !== undefined &&
        this.registerForm.value.city !== undefined &&
        this.registerForm.value.email !== undefined &&
        this.registerForm.value.password !== undefined) {
        const user: User = {
          firstname: this.registerForm.value.firstname.trimEnd(),
          lastname: this.registerForm.value.lastname.trimEnd(),
          street: this.registerForm.value.street.trimEnd(),
          house_no: this.registerForm.value.house_no.trimEnd(),
          postcode: this.registerForm.value.postcode.trimEnd(),
          city: this.registerForm.value.city.trimEnd(),
          email: this.registerForm.value.email.toLowerCase().trimEnd(),
          password: this.registerForm.value.password,
          role: 'visitor'
        };

        this.loginService.register(user).subscribe({
          next: () => {
            this.router.navigateByUrl('/map');
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = err.error.message;
            this.submitted = false;
          }
        });
      }
    }
  }
}