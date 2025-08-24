import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/events.service';
import { MainauEvent } from '../../../models/event';
import { LoginService } from 'src/app/services/login.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css', '../../../../styles.css']
})
export class EventDetailComponent implements OnInit {
  public event?: MainauEvent;
  public role = '';
  public inPast = false;

  constructor(private router: Router, public loginService: LoginService, private route: ActivatedRoute, protected eventsService: EventService) { }

  ngOnInit(): void {
    //get which event to display from route
    this.route.paramMap.pipe(
      switchMap((params) => of(params.get('id'))),
      switchMap((id) =>
        //guaranteed to be not null, because component has id param
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.eventsService.getEventById(parseInt(id!)))
    )
      .subscribe({
        next: ev => {
          this.event = ev;

          if (new Date(this.event.end_date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0))
            this.inPast = true;
        },
        error: err => {
          console.error(err);
        }
      });
    this.role = this.loginService.getRole();
  }

  public buyticket(): void {
    if (this.event?.id) {
      this.router.navigateByUrl('/events/' + this.event?.id.toString() + '/payment');
    }
  }
  public editEvent(): void {
    if (this.event?.id) {
      this.router.navigateByUrl('/events/' + this.event?.id.toString() + '/edit');
    }
  }
}

