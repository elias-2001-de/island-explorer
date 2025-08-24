import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['../../../../styles.css']
})

export class PasswordComponent implements OnInit {
  private user?: User;

  constructor(private router: Router, private loginService: LoginService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginService.getUser().subscribe({
      next: (val) => {
        this.user = val;
      },
      error: (err) => {
        this.user = undefined;
        console.error(err);
      }
    });

    this.passwordForm.get('passwordRep')?.setValidators(this.passwordRepValidator());

    // Submit the form on enter key press.
    // Before, the first button in the form was triggered when pressing enter, causing the first form field to be cleared.
    // This is the default form behavior and shall be prevented from now on.
    const form = document.querySelector('form');
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        form?.dispatchEvent(new Event('submit'));
      }
    });
  }

  passwordForm: FormGroup = this.fb.nonNullable.group({
    oldPassword: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordRep: ['', [Validators.required]],
  }, { updateOn: 'submit' });

  passwordRepValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value !== this.passwordForm.get('password')?.value || control.value === '') {
        return { 'PasswordsDoNotMatch': true };
      }
      return null;
    };
  }

  errorMessages: { [key: string]: string } = {
    oldPassword: 'Falsches Passwort.',
    password: 'Das neue Passwort muss mindestens 8 Zeichen lang sein.',
    passwordRep: 'Die Eingabe stimmt nicht mit dem neuen Passwort überein.',
  };

  async onSubmit(): Promise<void> {

    const oldPasswordCorrect: boolean = await this.validateOldPassword();

    this.passwordForm.markAllAsTouched();

    if (oldPasswordCorrect) {
      if (this.passwordForm.invalid) {
        return;
      }

      else if (this.passwordForm.valid) {
        if (this.user &&
          this.passwordForm.value.oldPassword !== undefined &&
          this.passwordForm.value.password !== undefined &&
          this.passwordForm.value.passwordRep !== undefined) {

          this.user.password = this.passwordForm.value.password;

          this.loginService.updateUser(this.user).subscribe({
            next: () => {
              this.router.navigateByUrl('/profile');
            },
            error: (err) => {
              console.error(err);
            }
          });
        }
      }
    }
  }

  async validateOldPassword(): Promise<boolean> {
    let passwordsMatch = false;
    //will cause delay if no value returned from checkPassword
    await firstValueFrom(this.loginService.checkPassword(this.passwordForm.value.oldPassword)) //actually wait for value to arrive because of async nature
      .then(val => { passwordsMatch = val; })
      .catch(err => {
        console.error(err);
        return false;
      });

    if (!passwordsMatch) {
      this.passwordForm.get('oldPassword')?.setErrors({ 'incorrectPassword': true });
      return false;
    }
    return true; //all checks passed
  }

  abbrechen(): void {
    this.router.navigateByUrl('/profile');
  }
}
