import { Component, OnInit } from '@angular/core';
import { AboutService, NameInfo } from 'src/app/services/about.service';

@Component({
  selector: 'app-jonathan-haessler',
  templateUrl: './jonathan-haessler.component.html',
  styleUrls: ['./jonathan-haessler.component.css']
})

export class JonathanHaesslerComponent implements OnInit {
  public myName?: NameInfo;

  constructor(private aboutService: AboutService) { }

  ngOnInit(): void {
    this.aboutService.getJonathanHaesslerInfo().subscribe({
      next: (val) => {
        this.myName = val;
      },
      error: (err) => {
        console.error(err);
        this.myName = {
          firstName: 'Error!',
          lastName: 'Error!'
        };
      }
    });
  }
}

