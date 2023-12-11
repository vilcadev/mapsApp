import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css']
})
export class MiniMapComponent {


  @Input() lngLat?: [number, number];

  @ViewChild('map') divMap?: ElementRef;

  ngAfterViewInit(){
    if(!this.divMap?.nativeElement) throw "Map Div not found"
    if(!this.lngLat) throw  'LngLat cant be null';

    //mapa
    const map = new Map({
      container: this.divMap?.nativeElement,
      style:'mapbox://styles/mapbox/streets-v12',
      center: this.lngLat,
      zoom: 15,
      interactive:false,
    });

    new Marker()
    .setLngLat( this.lngLat )
    .addTo( map )

    //marker
  }

}
