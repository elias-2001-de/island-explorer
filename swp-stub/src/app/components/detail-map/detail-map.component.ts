import { Component, Input, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-detail-map',
  templateUrl: './detail-map.component.html',
  styleUrls: ['./detail-map.component.css', '../../../styles.css']
})
export class DetailMapComponent implements OnInit {

  @Input() lat = 0;
  @Input() long = 0;

  public layers: Leaflet.Marker[] = [];

  public options: Leaflet.MapOptions = {
    layers: [new Leaflet.TileLayer('http://konstrates.uni-konstanz.de:8080/tile/{z}/{x}/{y}.png'),],
    zoom: 15.5,
    attributionControl: false
  };

  constructor() { }

  ngOnInit(): void {
    this.layers.push(Leaflet.marker([this.lat, this.long]));
    this.options.center = new Leaflet.LatLng(this.lat, this.long);
  }
}


