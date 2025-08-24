import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css', '../../../styles.css']
})
export class AboutComponent implements OnInit {

  constructor(public loginService: LoginService) { }
  ngOnInit(): void {
    if (!this.loginService.isLoggedIn()) {
      const page = document.getElementById('1') as HTMLElement;

      page.classList.remove('page-container');
      page.classList.add('page-containerAlt');
    }
  }

}
