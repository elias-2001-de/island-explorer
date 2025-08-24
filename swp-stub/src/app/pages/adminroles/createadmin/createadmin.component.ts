import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AdminrolesService } from 'src/app/services/adminroles.service';

@Component({
  selector: 'app-createadmin',
  templateUrl: './createadmin.component.html',
  styleUrls: ['./createadmin.component.css', '../../../../styles.css']
})
export class CreateadminComponent implements OnInit {

  public errorMessage: string | undefined = undefined;
  public submitted = false;

  public user?: User;

  constructor(private router: Router, private adminroleService: AdminrolesService, private fb: FormBuilder) { }

  registerForm = this.fb.nonNullable.group({
    firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9äöüÄÖÜß -]*\s*')]],
    lastname: ['', [Validators.required, Validators.pattern('[a-zA-ZäöüÄÖÜß -]*\s*')]],
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

  onSubmit(): void {
    //console.log('Error Messages:', this.errorMessages);
    //console.log('Here we gooo: ', this.registerForm.value);

    this.submitted = true; //disable button to prevent spamming

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
        this.registerForm.value.email !== undefined &&
        this.registerForm.value.password !== undefined) {
        const role = (document.querySelector('input[name="roleSelect"]:checked')?.id);
        this.user = {
          firstname: this.registerForm.value.firstname.trimEnd(),
          lastname: this.registerForm.value.lastname.trimEnd(),
          street: 'Insel Mainau',
          house_no: '1',
          postcode: '78465',
          city: 'Konstanz',
          email: this.registerForm.value.email.toLowerCase().trimEnd(),
          password: this.registerForm.value.password,
          role: role
        };

        this.adminroleService.createStaff(this.user).subscribe({
          next: () => {
            this.modal();
          },
          error: (err) => {
            this.submitted = false;
            console.error(err);
            this.errorMessage = err.error.message;
          }
        });
      }
    }
  }

  public modal(): void {

    const modal = document.getElementById('modal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  public close(): void {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.style.display = 'none';
    }
    this.router.navigateByUrl('adminroles');
  }

}