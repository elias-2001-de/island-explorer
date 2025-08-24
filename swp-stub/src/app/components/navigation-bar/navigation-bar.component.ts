import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

export interface NavigationEntry {
  icon: string; // full list of icons: https://www.angularjswiki.com/angular/angular-material-icons-list-mat-icon-list/
  url: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit, OnDestroy {
  private routerSub = Subscription.EMPTY;
  public role = '';
  public entries: NavigationEntry[] = [];

  constructor(private router: Router, public loginService: LoginService) { }

  //normal user
  public entriesUser: NavigationEntry[] = [{
    icon: 'map',
    url: '/map',
  },

  {
    icon: 'date_range',
    url: '/events'
  },

  {
    icon: 'local_activity',
    url: '/tickets'
  },

  {
    icon: 'local_florist',
    url: '/userfaq'
  },


  {
    icon: 'person',
    url: '/profile'
  }
  ];



  //admin bar
  public entriesAdmin: NavigationEntry[] = [
    {
      icon: 'map',
      url: '/map',
    },

    {
      icon: 'date_range',
      url: '/events'
    },

    {
      icon: 'note_add',
      url: '/post-event'
    },
    {
      icon: 'settings', //person_add
      url: '/adminroles'
    },

    {
      icon: 'person',
      url: '/profile'
    }


  ];
  //gärtner bar
  public entriesGardener: NavigationEntry[] = [
    {
      icon: 'map',
      url: '/map',
    },

    {
      icon: 'question_answer',
      url: '/gardenerfaq'
    },

    {
      icon: 'comment',
      url: '/chats'
    },

    {
      icon: 'person',
      url: '/profile'
    }
  ];


  ngOnInit(): void {
    this.role = this.loginService.getRole();

    if (this.role === 'admin' || this.role === 'root') {
      this.entries = this.entriesAdmin;
    } else if (this.role === 'gardener') {
      this.entries = this.entriesGardener;
    } else {
      this.entries = this.entriesUser;
    }

    if (this.routerSub !== Subscription.EMPTY) {
      this.routerSub.unsubscribe();
      this.routerSub = Subscription.EMPTY;
    }

    this.routerSub = this.router.events
      .subscribe((route) => {
        if (route instanceof NavigationEnd) {
          this.showActiveRoute(route.urlAfterRedirects);
        }
      });

    this.showActiveRoute(this.router.url); //get initial route after (re)load --> no event streamed from router in this case
  }


  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
    this.routerSub = Subscription.EMPTY;
  }

  private showActiveRoute(url: string): void {
    for (const entry of this.entries) {
      entry.isActive = url.startsWith(entry.url);
    }
  }
}
