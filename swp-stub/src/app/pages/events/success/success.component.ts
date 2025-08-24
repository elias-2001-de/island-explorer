import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['../payment.css', '../../../../styles.css']
})
export class SuccessComponent {

  constructor(private router: Router) { }
  toTicket(): void {
    this.router.navigate(['tickets']);
  }
  otherEvents(): void {
    this.router.navigate(['events']);
  }
}
