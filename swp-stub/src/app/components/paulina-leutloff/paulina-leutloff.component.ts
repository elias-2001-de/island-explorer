import { Component, OnInit } from '@angular/core';
import { AboutService, NameInfo } from 'src/app/services/about.service';

@Component({
  selector: 'app-paulina-leutloff',
  templateUrl: './paulina-leutloff.component.html',
  styleUrls: ['./paulina-leutloff.component.css']
})
export class PaulinaLeutloffComponent implements OnInit {
  public myName?: NameInfo;

  constructor(private aboutService: AboutService) { }

  ngOnInit(): void {
    this.aboutService.getPaulinaLeutloffInfo().subscribe({
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
