import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/events.service';
import { LoginService } from 'src/app/services/login.service';
import { MainauEvent } from '../../../models/event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css', '../../../../styles.css']
})
export class EventsComponent implements OnInit {
  public events?: MainauEvent[];
  public sortedEvents: MainauEvent[] = [];
  public search = '';
  public role = '';
  public showFav = false;
  public favId: number[] = [];
  public submitted = false; //boolean to check if popup should be displayed on events page

  constructor(private router: Router, private route: ActivatedRoute, protected eventsService: EventService, public loginService: LoginService) { }

  ngOnInit(): void {

    this.role = this.loginService.getRole();

    this.eventsService.getEvents()
      .subscribe({
        next: ev => {
          this.events = ev;

          //sort events by: 1. earlier start date 2. earlier end date
          this.events.sort((e1, e2) => {
            const d1 = new Date(e1.start_date);
            const d2 = new Date(e2.start_date);
            if (d1 < d2)
              return -1;
            else if (d1 > d2)
              return 1;
            else { //start dates are equal
              if (new Date(e1.end_date) < new Date(e2.end_date))
                return -1;
              else
                return 1;
            }
          });

          this.showFilteredEvents(this.search);

          if (this.role === 'visitor') {
            this.loadFav();
          }

          //check whether popup should be displayed
          this.submitted = this.eventsService.submitted;
          if (this.submitted) {
            this.modalSuccess();
          }
        },
        error: err => {
          console.error(err);
        }
      });
  }

  public showFilteredEvents(search: string): void {
    const regex = new RegExp(search, 'i');
    if (this.events) {
      this.sortedEvents = this.events.filter(event => {
        if (event.title)
          //returns true if title contains regex
          return regex.test(event.title);
        else
          return false;
      });

    }
  }

  public editEvent(eventId: number): void {
    this.router.navigate(['events/' + eventId.toString() + '/edit']);
  }

  public routeToAddEvent(): void {
    this.router.navigate(['events/post-event']);
  }

  //Favorite handling

  public loadFav(): void {
    this.eventsService.getAllFav()
      .subscribe({
        next: fav => {
          this.favId = fav;
          for (let index = 0; index < this.favId.length; index++) {
            this.events?.forEach(e => {
              e.isFav = this.favId.find(id => id === e.id) !== undefined;
            });
          }
        },
        error: err => {
          console.error(err);
        }
      });
  }

  public deleteFav(event: MainauEvent): void {

    this.eventsService.deleteFav(event.id);
    event.isFav = false;

    const modal = document.getElementById(event.id + 'modal') as HTMLElement;
    if (modal)
      modal.style.display = 'none';
  }

  public toggleFav(eventId: number): void {
    const currentEvent = this.events?.find(e => e.id === eventId);
    const button = document.getElementById('' + eventId) as HTMLElement;
    if (currentEvent?.isFav && button) {
      this.removeFavModal(currentEvent);
    } else if (button && currentEvent) {
      this.eventsService.addFav(eventId);
      currentEvent.isFav = true;
    }
  }

  //Organize popups

  //Are you sure you want to remove this favorite?
  public removeFavModal(event: MainauEvent): void {
    const id = event.id;
    const modal = document.getElementById(id + 'modal') as HTMLElement;
    if (modal)
      modal.style.display = 'block';
  }

  public closeOne(event: MainauEvent): void {
    const id = event.id;
    const modal = document.getElementById(id + 'modal') as HTMLElement;
    if (modal)
      modal.style.display = 'none';
  }

  //Event successfully added/edited
  public modalSuccess(): void {
    const modall = document.getElementById('success');
    if (modall)
      modall.style.display = 'block';
  }

  public closeSuccess(): void {
    const modal = document.getElementById('success');
    if (modal) { modal.style.display = 'none'; }
    this.eventsService.submitted = false;
  }

  public goToEventDetail(): void {
    this.eventsService.submitted = false;
    this.router.navigate(['events/' + this.eventsService.currentEventId]);
  }
}
