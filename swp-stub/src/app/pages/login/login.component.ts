import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../../styles.css']
})
export class LoginComponent {
  public errorMessage: string | undefined = undefined;

  constructor(private router: Router, private loginService: LoginService, private fb: FormBuilder) { }

  loginForm = this.fb.nonNullable.group({
    email: [''],
    password: ['']
  }, { updateOn: 'change' });

  keyDownFunction(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      if (this.loginForm.value.email !== undefined && this.loginForm.value.password !== undefined) {
        const email = this.loginForm.value.email.toLowerCase();
        const password = this.loginForm.value.password;

        this.loginService.login(email, password).subscribe({
          next: () => {
            this.errorMessage = undefined;
            this.router.navigateByUrl('/map');
          },
          error: (err) => {
            this.errorMessage = (this.loginForm.value.email === '' || this.loginForm.value.password === '') ? 'Bitte beide Felder ausfüllen.' : 'Benutzername und Passwort passen nicht zueinander.';
            console.error(err);
          }
        });
      }
    }
  }
}
