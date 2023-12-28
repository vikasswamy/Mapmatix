import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AddsiteComponent } from '../addsite/addsite.component';
import { MatDialog } from '@angular/material/dialog';
import { AddSpaceComponent } from '../addsite/site_onboarding/add-space/add-space.component';
import { AddFacilityComponent } from '../addsite/site_onboarding/add-facility/add-facility.component';
import { AddFloorComponent } from '../addsite/site_onboarding/add-floor/add-floor.component';
import { MaplocationService } from 'src/app/services/maplocation.service';
@Component({
  selector: 'app-airquaility',
  templateUrl: './airquaility.component.html',
  styleUrls: ['./airquaility.component.scss']
})
export class AirquailityComponent implements OnInit {
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
        this.formdata=data;
      });
     
    }else if(this.routeparams == 2){
      this.formelement = AddFacilityComponent;

      this.maplocationservice.locateFacility.subscribe((location:any)=>{
        this.facilityLocation=location
      });
      
      this.maplocationservice.addFacilityData.subscribe((data:any)=>{
        console.log(data,"::facility params");
        this.formdata=data;
      })
    }else if(this.routeparams ==3){
      this.formelement = AddFloorComponent
    }
   
  }

  ngOnInit() {
    
   let mapZoom:any= this.facilityLocation.length == 0 ? 0 : 19 ;
    let mapcenter = this.facilityLocation.length == 0 ? [-24, 42] :this.facilityLocation ;
    (mapboxgl as typeof mapboxgl).accessToken= 'pk.eyJ1IjoidmlrYXMtc3dhbXkiLCJhIjoiY2t3eWticmc1MG5yZjM0cXR3czBheDMyeCJ9.ROb_2S1Qd_47JhnT_x6xMQ';
    const map:any = new mapboxgl.Map({
    container: 'mapa-mapbox', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
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
    if(this.routeparams == 1 || this.routeparams == 2){
     
       function add_marker (event:any) {
        var coordinates = event.lngLat;
        self.formdata.lan=coordinates.lng;
        self.formdata.lat =coordinates.lat;
        console.log('Lng:', coordinates.lng, 'Lat:', coordinates.lat);
        marker.setLngLat(coordinates).addTo(map);
       
         self.opendialog()
        
      }
      
      map.once('dblclick', add_marker)
      marker.on('dragend', onDragEnd);

      function onDragEnd() {
        const lngLat = marker.getLngLat();
        console.log(lngLat,"lngLat");
        self.formdata.lan=lngLat.lng;
        self.formdata.lat =lngLat.lat;
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
    console.log(this.formdata,"openDialog")
    // this.formdata.lng=this.longitude;
    // this.formdata.lat= this.latitude;
    this.maplocationservice.addsitevalues(this.formdata)

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
