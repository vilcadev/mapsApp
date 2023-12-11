import { Component, ElementRef, ViewChild } from '@angular/core';
import { Map, LngLat, Marker } from 'mapbox-gl';

interface MarkerAndColor{
  color: string;
  marker: Marker;
}

interface PlainMarker{
  color: string,
  lngLat: number[]
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent {

  @ViewChild('map') divMap?: ElementRef;

  public markers: MarkerAndColor[] =[];

  public  zoom: number = 13;
  public map?:Map;
  public currentLngLat: LngLat = new LngLat(-76.9363129528211, -12.20856593741253);

  ngAfterViewInit(): void {

    if(!this.divMap) throw 'El elemento HTML no fue encontrado'

    this.map = new Map({
      container: this.divMap?.nativeElement,
      style:'mapbox://styles/mapbox/streets-v12',
      center: this.currentLngLat,
      zoom: this.zoom,
    });

    this.readFromLocalStorage();


    // Puede crear una marcador personalizado:
    // const markerHtml = document.createElement('div');
    // markerHtml.innerHTML = 'Cesar Vilca'


    // const marker = new Marker({
    //   // color:'red'
    //   // element:markerHtml
    // })
    // .setLngLat( this.currentLngLat )
    // .addTo( this.map );
  }

  createMarker(){
    if(!this.map) return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map?.getCenter();

    this.addMarker( lngLat, color )
  }

  addMarker(lngLat: LngLat, color: string){
    if(!this.map) return;

    const marker = new Marker({
      color: color,
      draggable: true
    }).setLngLat( lngLat )
      .addTo( this.map );

    this.markers.push({

      // Pueder colocar esto sola mente así: color , marker, ya que es redundante (ES6)
      color: color,
      marker: marker,
    })

    this.saveToLocalStorage();


    // Llamamos al saveToLocalStorage defrente, ya que el array markers[] pasa por referencia.
    marker.on('dragend', () => this.saveToLocalStorage());

    // dragend
  }

  deleteMarker(index: number){
    this.markers[index].marker.remove();
    this.markers.splice(index, 1);
  }

  flyTo(marker: Marker){

    this.map?.flyTo({
      zoom:14,
      center:marker.getLngLat()
    })
  }


  saveToLocalStorage(){

    // Aplicamos Desestructuración en ({ color, marker })=
    const plainMarkers:PlainMarker[] = this.markers.map(({ color, marker })=>{
      return {
        color: color,
        lngLat: marker.getLngLat().toArray()
      }
    });
    localStorage.setItem('plainMarkers',JSON.stringify(plainMarkers));

  }

  readFromLocalStorage(){
    const plainMarkerString = localStorage.getItem('plainMarkers') ?? '[]';

    // !OJO: Puede que el objeto plainMarkerString no tenga las propiedades de lo que es
    // - un PlainMarker
    const plainMarkers:PlainMarker[] = JSON.parse(plainMarkerString);

    // Aplicamos Desestructuración en ({ color, lngLat })
    plainMarkers.forEach( ({ color, lngLat }) =>{

      //Desestructuración de lngLat
      const [ lng,lat ] = lngLat;
      const coords = new LngLat( lng, lat );

      this.addMarker( coords, color );


    })
  }
}
