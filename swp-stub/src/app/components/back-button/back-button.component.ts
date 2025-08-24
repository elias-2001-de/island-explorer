import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.css']
})
export class BackButtonComponent {
  @Input()
  public headline?= '';
  constructor(private location: Location) { }

  back(): void {
    this.location.back();
  }
}
