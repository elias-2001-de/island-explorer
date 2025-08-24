import { Component, OnInit } from '@angular/core';
import { AboutService, NameInfo } from 'src/app/services/about.service';

@Component({
  selector: 'app-robin-erb',
  templateUrl: './robin-erb.component.html',
  styleUrls: ['./robin-erb.component.css']
})
export class RobinErbComponent implements OnInit {
  public myName?: NameInfo;

  constructor(private aboutService: AboutService) { }

  ngOnInit(): void {
    this.aboutService.getRobinErbInfo().subscribe({
      next: (val) => {
        this.myName = val;
      },

      error: (err) => {
        console.error(err);
        this.myName = {
          firstName: 'Error!',
          lastName: 'Error!',
          optionalAttributOne: 'Error!',
          optionalAttributTwo: 'Error!',
          optionalAttributThree: 'Error!'
        };
      }
    });
  }

}
