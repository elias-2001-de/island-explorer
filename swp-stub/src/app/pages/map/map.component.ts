import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationsService } from 'src/app/services/locations.service';
import * as Leaflet from 'leaflet';

@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css', '../../../styles.css']
})
export class MapComponent implements OnInit {
  options: Leaflet.MapOptions = {
    layers: [new Leaflet.TileLayer('http://konstrates.uni-konstanz.de:8080/tile/{z}/{x}/{y}.png'),],
    zoom: 16,
    center: new Leaflet.LatLng(47.70475111537479, 9.195249855100897),
    attributionControl: false
  };

  layers: Leaflet.Marker[] = [];

  constructor(private router: Router, private locationsService: LocationsService, private ngZone: NgZone) { }

  ngOnInit(): void {

    this.locationsService.getLocations().subscribe({
      next: () => {
        for (const location of this.locationsService.locations) {
          this.layers.push(Leaflet.marker([location.coordinates_lat, location.coordinates_lng], {
            title: location.id.toString()
          }));
        }

        for (const layer of this.layers) {
          layer.on('click', () => {

            const title = layer.options.title;
            if (title) {
              this.locationsService.getLocationById(parseInt(title)); //save clicked location in locationsService
              this.ngZone.run(() => this.router.navigateByUrl('/map/'.concat(title)));
            }
          });
        }
      },
      error: (err) => {
        console.error(err);
      }
    });

  }
}
