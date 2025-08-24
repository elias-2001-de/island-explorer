import { Component, OnInit } from '@angular/core';
import { AboutService, NameInfo } from 'src/app/services/about.service';

@Component({
  selector: 'app-nicolas-luckert',
  templateUrl: './nicolas-luckert.component.html',
  styleUrls: ['./nicolas-luckert.component.css']
})
export class NicolasLuckertComponent implements OnInit {
  public myName?: NameInfo;

  constructor(private aboutService: AboutService) { }

  ngOnInit(): void {
    this.aboutService.getNicolasLuckertInfo().subscribe({
      next: (nameVal) => { this.myName = nameVal; },

      error: (err) => {
        console.log(err);
        this.myName = {
          firstName: 'Error!',
          lastName: 'Name-not-fetched'
        };
      }
    });
  }

}
