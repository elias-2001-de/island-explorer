import { Component, OnInit } from '@angular/core';
import { AboutService, NameInfo } from 'src/app/services/about.service';

@Component({
  selector: 'app-lucia-schopper',
  templateUrl: './lucia-schopper.component.html',
  styleUrls: ['./lucia-schopper.component.css']
})
export class LuciaSchopperComponent implements OnInit {

  public myName?: NameInfo;
  constructor(private about: AboutService) { }

  ngOnInit(): void {
    this.about.getLuciaSchopperInfo().subscribe({
      next: (nameResponse) => {
        this.myName = nameResponse;
      },

      error: (err) => {
        console.error(err);
        this.myName = {
          firstName: 'Error-First not found',
          lastName: 'Error-Last not found'
        };
      }
    });
  }

}
