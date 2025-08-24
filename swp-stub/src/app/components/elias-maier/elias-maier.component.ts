import { Component, OnInit } from '@angular/core';
import { AboutService, NameInfo } from 'src/app/services/about.service';

@Component({
  selector: 'app-elias-maier',
  templateUrl: './elias-maier.component.html',
  styleUrls: ['./elias-maier.component.css']
})
export class EliasMaierComponent implements OnInit {
  public myName?: NameInfo;

  constructor(private aboutService: AboutService) { }

  ngOnInit(): void {
    this.aboutService.getEliasMaierInfo().subscribe({
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
