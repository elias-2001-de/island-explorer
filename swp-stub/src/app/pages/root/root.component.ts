import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css'],
  selector: 'app-root'
})
export class RootComponent {
  constructor(public loginService: LoginService) { }
}
