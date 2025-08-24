import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../../styles.css']
})
export class ProfileComponent implements OnInit {

  public user?: User;

  constructor(private router: Router, private loginService: LoginService) { }

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
  }

  logout(): void {
    this.loginService.logout().subscribe({
      next: () => {
        this.router.navigate(['login']);
      },
      error: () => {
        this.loginService.loggedIn = false; //deleting session from db should never fail and cookie gets cleared either way, so this should be okay
        this.loginService.authChecked = false;
        this.router.navigate(['login']);
      }
    });
  }

}