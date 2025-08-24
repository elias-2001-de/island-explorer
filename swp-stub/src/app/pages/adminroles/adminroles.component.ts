import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AdminrolesService } from 'src/app/services/adminroles.service';

@Component({
  selector: 'app-adminroles',
  templateUrl: './adminroles.component.html',
  styleUrls: ['./adminroles.component.css', '../../../styles.css']
})
export class AdminrolesComponent implements OnInit {

  public adminroles?: User[];
  public allAdminroles: User[] = [];
  public search = '';

  constructor(private router: Router, private route: ActivatedRoute, protected adminrolesService: AdminrolesService) { }

  ngOnInit(): void {
    this.adminrolesService.getAdminroles()
      .subscribe({
        next: ar => {
          this.adminroles = ar;
          this.showFilteredAdminroles(this.search);
        },
        error: err => {
          console.error(err);
        }
      });
  }

  public showFilteredAdminroles(search: string): void {
    const regex = new RegExp(search.replace(/\s/g, ''), 'i');
    if (this.adminroles) {
      this.allAdminroles = this.adminroles.filter(admin => {
        if (admin.firstname && admin.lastname)
          return regex.test(admin.firstname + admin.lastname);
        else
          return false;
      });
    }
  }

  public deleteStaff(staff: User): void {
    this.adminrolesService.deleteStaff(staff.email).subscribe({
      next: () => {
        this.ngOnInit();
      },
      error: err => {
        console.error(err);
      }
    });
  }

  public modal(staff: User): void {
    const id = staff.email;
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'block';
    }
  }

  public close(staff: User): void {
    const id = staff.email;
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'none';
    }
  }
}

