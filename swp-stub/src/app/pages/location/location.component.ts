import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationsService } from 'src/app/services/locations.service';
import { Location } from '../../models/location';
import { of, switchMap } from 'rxjs';
import * as Leaflet from 'leaflet';

@Component({
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css', '../../../styles.css']
})
export class LocationComponent implements OnInit {
  public location?: Location;

  //!!!CLEAR LOCATION on leaving component

  constructor(private router: Router, private route: ActivatedRoute, protected locationsService: LocationsService) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params) => of(params.get('id'))),
      switchMap((id) =>
        //guaranteed to be not null, because component has id param
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.locationsService.getLocationById(parseInt(id!)))
    )
      .subscribe({
        next: loc => {
          this.location = loc;
          if (loc.picture) { this.location.picture = '/assets/mock-backend/img/locations/'.concat(loc.picture); }
        },
        error: err => {
          console.error(err);
        }
      });

  }

  onMapClick(e: Leaflet.LeafletMouseEvent): void {
    console.log(`${e.latlng.lat}, ${e.latlng.lng}`);
  }
}
