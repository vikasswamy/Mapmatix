import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MaplocationService } from 'src/app/services/maplocation.service';
import { AddsiteComponent } from '../addsite.component';
import { AddFacilityComponent } from '../site_onboarding/add-facility/add-facility.component';
import { AddFloorComponent } from '../site_onboarding/add-floor/add-floor.component';
import { AddSpaceComponent } from '../site_onboarding/add-space/add-space.component';
//import interact from 'interactjs';

@Component({
  selector: 'app-geo-referencing-map',
  templateUrl: './geo-referencing-map.component.html',
  styleUrls: ['./geo-referencing-map.component.scss' ]
})
export class GeoReferencingMapComponent implements OnInit {
  routeparams:any;
  facilityLocation:any=[];
  formelement: any;
  longitude:any;
  latitude:any;
  formdata: any;
  constructor( private route: ActivatedRoute, public dialog: MatDialog, private maplocationservice: MaplocationService) { 
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
    
   let mapZoom:any= this.facilityLocation.length == 0 ? 3 : 19 ;
    let mapcenter = this.facilityLocation.length == 0 ? [-24, 42] :this.facilityLocation ;
    (mapboxgl as typeof mapboxgl).accessToken= 'pk.eyJ1IjoidmlrYXMtc3dhbXkiLCJhIjoiY2t3eWticmc1MG5yZjM0cXR3czBheDMyeCJ9.ROb_2S1Qd_47JhnT_x6xMQ';
    const map:any = new mapboxgl.Map({
    container: 'mapa-mapbox', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    //style: 'mapbox://styles/mapbox/streets-v12', // style URL
    style:'mapbox://styles/mapbox/satellite-streets-v12',
    center:mapcenter, // starting center in [lng, lat]
    zoom: mapZoom // starting zoom
    });
    var self:any=this;
    var marker:any = new mapboxgl.Marker({
      draggable: true,
      color: 'red',
      scale: 0.8,
      pitchAlignment: 'auto',
      rotationAlignment: 'auto'
    }
    );
    if(this.routeparams == 1 || this.routeparams == 2 ){
     
       function add_marker (event:any) {
        var coordinates = event.lngLat;
        self.formdata[0].lan=coordinates.lng;
        self.formdata[0].lat =coordinates.lat;
        marker.setLngLat(coordinates).addTo(map);
       
         self.opendialog()
        
      }
      
      map.once('dblclick', add_marker)
      marker.on('dragend', onDragEnd);

      function onDragEnd() {
        const lngLat = marker.getLngLat();
        self.formdata[0].lan=lngLat.lng;
        self.formdata[0].lat =lngLat.lat;
        self.opendialog()
        }
      }
      if(this.routeparams == 1 ){
        map.addControl(
          new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl
          })
          );
    }
   
  
  
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
