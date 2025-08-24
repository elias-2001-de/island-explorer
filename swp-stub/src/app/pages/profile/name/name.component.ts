import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['../../../../styles.css']
})
export class NameComponent implements OnInit {
  // Initiate the user to something to get rid of the annoying '?'
  public user?: User;

  constructor(private router: Router, private loginService: LoginService, private fb: FormBuilder) { }

  form = document.querySelector('form');

  // Fetch the user from database
  ngOnInit(): void {
    this.loginService.getUser().subscribe({
      next: (val) => {
        this.user = val;
        this.nameForm.setValue({
          firstname: this.user.firstname,
          lastname: this.user.lastname
        });
      },
      error: (err) => {
        this.user = undefined;
        console.error(err);
      }
    });

    // Submit the form on enter key press.
    // Before, the first button in the form was triggered when pressing enter, causing the first form field to be cleared.
    // This is the default form behavior and shall be prevented from now on.
    this.form = document.querySelector('form');
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.form?.dispatchEvent(new Event('submit'));
      }
    });
  }

  nameForm: FormGroup = this.fb.nonNullable.group({
    firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9äöüÄÖÜß -]*')]],
    lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9äöüÄÖÜß -]*')]],
  }, { updateOn: 'submit' });

  errorMessages: { [key: string]: string } = {
    firstname: 'Dieses Feld bitte ausfüllen.',
    lastname: 'Dieses Feld bitte ausfüllen.',
  };

  onSubmit(): void {

    if (this.nameForm.invalid) {
      this.nameForm.markAllAsTouched();
      return;
    }
    else if (this.nameForm.valid) {
      if (this.user &&
        this.nameForm.value.firstname !== undefined &&
        this.nameForm.value.lastname !== undefined) {

        this.user.firstname = this.nameForm.value.firstname;
        this.user.lastname = this.nameForm.value.lastname;

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

  abbrechen(): void {
    this.router.navigateByUrl('/profile');
  }
}
