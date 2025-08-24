import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css', '../../../../styles.css']
})
export class AddressComponent implements OnInit {
  public user?: User;

  constructor(private router: Router, private loginService: LoginService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginService.getUser().subscribe({
      next: (val) => {
        this.user = val;
        this.addressForm.setValue({
          street: this.user.street,
          house_no: this.user.house_no,
          postcode: this.user.postcode,
          city: this.user.city
        });
      },
      error: (err) => {
        this.user = undefined;
        console.error(err);
      }
    });
  }

  addressForm: FormGroup = this.fb.nonNullable.group({
    street: [(this.user !== undefined ? this.user.street : ''), [Validators.required, Validators.pattern('[a-zA-Z0-9äöüÄÖÜß -]*\s*')]],
    house_no: [(this.user !== undefined ? this.user.house_no : ''), [Validators.required, Validators.pattern('[0-9]+[a-zA-Z0-9äöüÄÖÜß]*\s*')]],
    postcode: [(this.user !== undefined ? this.user.postcode : ''), [Validators.required, Validators.pattern('[0-9]{5}\s*')]],
    city: [(this.user !== undefined ? this.user.city : ''), [Validators.required]],
  }, { updateOn: 'change' });

  errorMessages: { [key: string]: string } = {
    street: 'Keine gültige Straße.',
    house_no: 'Muss mit einer Zahl beginnen.',
    postcode: 'Postleitzahl muss aus genau 5 Zahlen bestehen.',
    city: 'Keine gültige Stadt.',
  };

  onSubmit(): void {

    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    else if (this.addressForm.valid) {
      if (this.user &&
        this.addressForm.value.street !== undefined &&
        this.addressForm.value.house_no !== undefined &&
        this.addressForm.value.postcode !== undefined &&
        this.addressForm.value.city !== undefined) {

        this.user.street = this.addressForm.value.street.trimEnd();
        this.user.house_no = this.addressForm.value.house_no.trimEnd();
        this.user.postcode = this.addressForm.value.postcode.trimEnd();
        this.user.city = this.addressForm.value.city.trimEnd();

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
