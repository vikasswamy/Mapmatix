import { Component, OnInit , NgZone,ViewChild} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MaplocationService,Maps } from 'src/app/services/maplocation.service';
import { AddsiteComponent } from '../addsite.component';
import { AddFacilityComponent } from '../site_onboarding/add-facility/add-facility.component';
import { AddFloorComponent } from '../site_onboarding/add-floor/add-floor.component';
import { AddSpaceComponent } from '../site_onboarding/add-space/add-space.component';

import * as maptalks from "maptalks";

const place = null as google.maps.places.PlaceResult;
type Components = typeof place.address_components;

@Component({
  selector: 'app-geo-referencing-map',
  templateUrl: './geo-referencing-map.component.html',
  styleUrls: ['./geo-referencing-map.component.scss' ]
})
export class GeoReferencingMapComponent implements OnInit {
  @ViewChild('search') searchElementRef:any;
   
  public entries = [];

  public place: google.maps.places.PlaceResult;
  map: any;
  routeparams:any;
  facilityLocation:any=[];
  formelement: any;
  longitude:any;
  latitude:any;
  formdata: any;
  constructor( private route: ActivatedRoute, public dialog: MatDialog, private maplocationservice: MaplocationService, private ngZone :NgZone) { 
    this.routeparams = this.route.snapshot.paramMap.get('id');
    if(this.routeparams == 1){
      this.formelement = AddsiteComponent;
      this.maplocationservice.addSiteData.subscribe((data:any)=>{
        console.log(data,"::::addsite formdata::::")
        this.formdata=data;
      });
     
    }else if(this.routeparams == 2){
      this.formelement = AddFacilityComponent;

      this.maplocationservice.locateFacility.subscribe((location:any)=>{
        this.facilityLocation=location
      });
      
      this.maplocationservice.addFacilityData.subscribe((data:any)=>{
        this.formdata=data;
      })
    }
   
   
  }

  ngOnInit() {
    this.maplocationservice.api.then((maps) => {
      this.initAutocomplete(maps);
      //this.initMap(maps);
    });
    this.initmap()
  }
  initmap(){
     let mapZoom:any= this.facilityLocation.length == 0 ? 3 : 19 ;
     let mapcenter =this.facilityLocation.length == 0 ? [-1.85306,52.63249] :this.facilityLocation ;
    (document.getElementById('mapa-mapbox')as HTMLElement).innerHTML='';
    this.map=null;
    this.map = new maptalks.Map("mapa-mapbox", {
      center :mapcenter,
      zoom: mapZoom,
      minZoom:2,
      pitch: 6,
      baseLayer: new maptalks.TileLayer("base", {
        urlTemplate:
          "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
        subdomains: ['mt0','mt1','mt2','mt3'],
        attribution:
          '© <a href="http://osm.org">OpenStreetMap</a>  contributors, © <a href="https://carto.com/">CARTO</a> ',
      }),
    });
    document.querySelector(".maptalks-attribution").innerHTML=''
    var layer:any = new maptalks.VectorLayer('vector').setOptions({
      editable : true,
    }).addTo(this.map);

    

   if(this.routeparams == 2){
   
    this.map.once('click',(e:any)=>{
       new maptalks.Marker(
        e.coordinate,
        {
          'draggable' : true
        }
      ).addTo(this.map.getLayer('vector')).on('dragend',(e:any)=>{
        const lngLat = e.coordinate;
      this.formdata[0].lan=lngLat.x;
      this.formdata[0].lat =lngLat.y;
      console.log(this.formdata[0])
      this.opendialog()
      });
      const lngLat = e.coordinate;
      this.formdata[0].lan=lngLat.x;
      this.formdata[0].lat =lngLat.y;
      console.log(this.formdata[0])
      this.opendialog()
    })
   }
    // (mapboxgl as typeof mapboxgl).accessToken= 'pk.eyJ1IjoidmlrYXMtc3dhbXkiLCJhIjoiY2t3eWticmc1MG5yZjM0cXR3czBheDMyeCJ9.ROb_2S1Qd_47JhnT_x6xMQ';
    // const map:any = new mapboxgl.Map({
    // container: 'mapa-mapbox', // container ID
    // // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    // //style: 'mapbox://styles/mapbox/streets-v12', // style URL
    // style:'mapbox://styles/mapbox/satellite-streets-v12',
    // center:mapcenter, // starting center in [lng, lat]
    // zoom: mapZoom // starting zoom
    // });
    // var self:any=this;
    // var marker:any = new mapboxgl.Marker({
    //   draggable: true,
    //   color: 'red',
    //   scale: 0.8,
    //   pitchAlignment: 'auto',
    //   rotationAlignment: 'auto'
    // }
    // );
    // if(this.routeparams == 1 || this.routeparams == 2 ){
     
    //    function add_marker (event:any) {
    //     var coordinates = event.lngLat;
    //     self.formdata[0].lan=coordinates.lng;
    //     self.formdata[0].lat =coordinates.lat;
    //     marker.setLngLat(coordinates).addTo(map);
       
    //      self.opendialog()
        
    //   }
      
    //   map.once('dblclick', add_marker)
    //   marker.on('dragend', onDragEnd);

    //   function onDragEnd() {
    //     const lngLat = marker.getLngLat();
    //     self.formdata[0].lan=lngLat.lng;
    //     self.formdata[0].lat =lngLat.lat;
    //     console.log(self.formdata[0])
    //     self.opendialog()
    //     }
    //   }
   
  }
  initAutocomplete(maps: Maps) {
    let autocomplete:any = new maps.places.Autocomplete(
      this.searchElementRef.nativeElement
     
    );
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        this.onPlaceChange(autocomplete.getPlace());
      });
    });
  }
  onPlaceChange(place: google.maps.places.PlaceResult) {
    
   // this.map.setCenter(place.geometry.location);

    // const pin = this.pin('red');

    // const marker = new google.maps.Marker({
    //   position: place.geometry.location,
    //   animation: google.maps.Animation.DROP,
    //   map: this.map,
    //   draggable:true,
    //   icon: this.pin('red'),
    // });

 

   const location:any = this.locationFromPlace(place);
   

    this.entries.unshift({
      place,
      location,
    });
    console.log([this.entries[0].location.coordinates.longitude, this.entries[0].location.coordinates.latitude],"lnglat");
    this.map.setCenterAndZoom([this.entries[0].location.coordinates.longitude, this.entries[0].location.coordinates.latitude], 21);
    var point = new maptalks.Marker(
      [this.entries[0].location.coordinates.longitude, this.entries[0].location.coordinates.latitude],
      {
        'draggable' : true
      }
    ).addTo(this.map.getLayer('vector'));
    point.addEventListener('dragend',(e:any)=>{
      console.log(e,"afterdraging");
      const lngLat = e.coordinate;
        this.formdata[0].lan=lngLat.x;
        this.formdata[0].lat =lngLat.y;
        console.log(this.formdata[0])
        this.opendialog()
    })
    //new maptalks.VectorLayer('marker', point)
  }
  public locationFromPlace(place: google.maps.places.PlaceResult) {
    const components = place.address_components;
    if (components === undefined) {
      return null;
    }

    const areaLevel3 = getShort(components, 'administrative_area_level_3');
    const locality = getLong(components, 'locality');

    const cityName = locality || areaLevel3;
    const countryName = getLong(components, 'country');
    const countryCode = getShort(components, 'country');
    const stateCode = getShort(components, 'administrative_area_level_1');
    const name = place.name !== cityName ? place.name : null;

    const coordinates = {
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    };

    const bounds = place.geometry.viewport.toJSON();

    // placeId is in place.place_id, if needed
    return {
      name,
      cityName,
      countryName,
      countryCode,
      stateCode,
      bounds,
      coordinates,
    };
  }
  opendialog(){
    // this.formdata.lng=this.longitude;
    // this.formdata.lat= this.latitude;
    if(this.routeparams==1){
      this.maplocationservice.addsitevalues(this.formdata)
    }
    else if(this.routeparams==2){
      this.maplocationservice.addFacilityvalues(this.formdata);
    }

     this.dialog.open(this.formelement, {
        closeOnNavigation: true,
        autoFocus: true,
        data: event,
        //disableClose: true,
        position:{
          left: '100px',
          top:'0px'
        }
      });
    }
  
}
function getComponent(components: Components, name: string) {
  return components.filter((component) => component.types[0] === name)[0];
}

function getLong(components: Components, name: string) {
  const component = getComponent(components, name);
  return component && component.long_name;
}

function getShort(components: Components, name: string) {
  const component = getComponent(components, name);
  return component && component.short_name;
}
namespace cosmos {
  export interface Coordinates {
    /**
     * Coordinates latitude.
     * @type {number}
     */
    latitude: number;
    /**
     * Coordinates longitude.
     * @type {number}
     */
    longitude: number;
  }
  export interface LatLngBoundsLiteral {
    /**
     * LatLngBoundsLiteral east.
     * @type {number}
     */
    east: number;
    /**
     * LatLngBoundsLiteral north.
     * @type {number}
     */
    north: number;
    /**
     * LatLngBoundsLiteral south.
     * @type {number}
     */
    south: number;
    /**
     * LatLngBoundsLiteral west.
     * @type {number}
     */
    west: number;
  }
}