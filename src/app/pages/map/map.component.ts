import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import * as L from 'leaflet';

import * as maptalks from "maptalks";
import { NavigationEnd, Router } from "@angular/router";
import * as moment from "moment";
import { filter, startWith } from "rxjs/operators";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { FormControl } from "@angular/forms";
import { formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { SettingsComponent } from '../settings/settings.component';
import { AddbuildingpopupComponent } from '../addbuildingpopup/addbuildingpopup.component';
import { SiteonboardingService } from '../addbuildingpopup/siteonboarding.service';
import{ui}from 'maptalks'
export interface CustomHtmlOptions extends ui.UIMarkerOptions{
  id: any;
  type:any;
  name:any;
}
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: any;
  selectedsiteFacilities:any=[];
  selectedLevels:any=[]
  sitemarker:any=null;
  facilitymarker:any=null;
  facilityName:any;
  showRefresh:boolean=false;
  showicons:boolean=false;
  levelName:any
  markerLocations = [
    {
      lat: 38.914764662971436,
      lng: -97.01461108304595
    },
     {
       lat: 2,
       lng: 2
     }
  ]

  @ViewChild('map')
  private mapContainer: ElementRef<HTMLElement>;
  polygons: any=[];
  layer:any;
  centeroid: any={
    type: "FeatureCollection",
    features: []
  } ;
  Devicescentroid: any=[];
  Devicegeojson:any={
    type: "FeatureCollection",
    features: []
  }
  focuspoint: any;
  sitename: any;
  sitesdata: any=[];
  constructor(
    public dialog: MatDialog,private http: HttpClient,public snackBar: MatSnackBar,
    private router: Router,
    private siteonboarding : SiteonboardingService
  ) { 
    this.router.events
    .pipe(filter((event: any) => event instanceof NavigationEnd))
    .subscribe((event: { url: any }) => {
      if (
        event.url != "/map"  
        
      ) {
        this.dialog.closeAll()
      }
     
    });
   
  }
  
  ngOnInit() {
    this.getAllSites();
    this.getAllFacilities();
    this.getAllLevels();
    //this.loadMap();
    
    
   }
   loadMap(data:any){
    (document.getElementById('map')as HTMLElement).innerHTML='';
    this.map=null;
    this.showRefresh=false;
    this.showicons=false;
    
    this.map = new maptalks.Map("map", {
      center : [-1.85306,52.63249],
      zoom: 2.5,
      minZoom:2,
      pitch: 6,
      baseLayer: new maptalks.TileLayer("base", {
        urlTemplate:
          "http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
        subdomains: ['mt0','mt1','mt2','mt3'],
        attribution:
          '© <a href="http://osm.org">OpenStreetMap</a>  contributors, © <a href="https://carto.com/">CARTO</a> ',
      }),
    });
    this.layer = new maptalks.VectorLayer("vector").setOptions({enableAltitude:true}).addTo(this.map);
     document.querySelector(".maptalks-attribution").innerHTML=''
    
    console.log(this.sitesdata)
    if(this.sitesdata){
      this.plotingsitemarkers(this.sitesdata);
    }
   }
   getAllSites(){
    var self:any=this;
    this.siteonboarding.getAllSites().subscribe((response:any)=>{
      if(response){
        this.sitesdata=response
      this.siteonboarding.saveAllsiteDetails(response);
       this.loadMap(this.sitesdata)

      }
    });
  }
  plotingsitemarkers(sties:any){
    this.selectedsiteFacilities=[]
    this.facilityName=null;
    this.sitename = null;
   console.log(sties,":::sites:::")
    
    sties.forEach((site:any) => {
      let sitename= site.siteName;
      
      let customoptions:CustomHtmlOptions= {
        'draggable': false,
        'single': false,
        'id' : site.siteId,
        'name': site.siteName,
        'type': 'sitemarker',
        'content': `
        <style>   
        .main {
          min-height: 50px;
          min-width: 200px;
          background-color: #673ab7;
          border-radius: 8px;
          display: flex;
          padding: 5px;
          box-sizing: border-box;
          position: relative;
      }
      .main::after{
          content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-width: 10px;
        border-style: solid;
        border-color: #673ab7 transparent transparent transparent;
      }
      .marker{
          max-width: 100%; 
          display: flex;
      }
      
      .image{
          background-color: none;
          border-radius: 5px;
          width: 40px;
          height: 100%;
          margin-right: 5px;
          flex: 1;
      }
      
      .image img{
          width: 100%;
          height: 100%;
          object-fit: fill;
          border-radius: 5px;
      }
      
      .info{
          /* background-color: aquamarine; */
          height: 100%;
          width: 100%;
          display: flex;
          flex: 2;
          flex-grow: 5;
          flex-direction: column;
          padding-left: 10px;
          color:#ffff;

      }
      .title{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
      }

        </style>
        <div class="marker" id='sitemarker'>
        <div class="main">
          <div class="image">
          <img src='${site.fileUrl}' alt="Profile Image">
          </div>
          <div class="info">
            <div class="title">${site.siteName}</div>
            <div class="contant">&#127970;No.of Facilities: ${site.total_Facilities}</div>
          </div>
        </div>
      </div>
       
        `,
      }
      this.sitemarker= new ui.UIMarker(site.location.coordinates, customoptions).addTo(this.map).on('click', (e:any)=> {  
      
        this.siteonboarding.obtainedFacilityDetails.subscribe((data:any)=>{
          console.log( e.target.options.id)
          data.forEach((facility:any,index:any) => {
            if(facility.Site_Id == e.target.options.id ){
              this.selectedsiteFacilities.push(data[index]);
            }
          });               
        })
        console.log(this.selectedsiteFacilities,"matched facilities")
                this.sitename= e.target.options.name;
                 this.gotofacilities(this.selectedsiteFacilities);
                
              //this.sitemarker.setContent('');
               //console.log(e.target.getContent())
                 //(document.getElementById('sitemarker')as HTMLElement).innerHTML=''; 
                 e.target.remove() ;
      })
     
    });
  }
  gotofacilities(facilities:any){   
     this.facilitymarker=null;
    this.levelName=null;
    this.selectedLevels=[];
    facilities.forEach((facility:any,j:any) => {
          console.log(facility.fileUrl)
      let customoptions:CustomHtmlOptions= {
        'draggable': false,
        'single': false,
        'id' : facility.facilityId,
        'name':facility.facilityName,
        'type': 'facilitymarker',
        'content': `
        <style>   
        .main {
          min-height: 50px;
          min-width: 200px;
          background-color: #673ab7;
          border-radius: 8px;
          display: flex;
          padding: 5px;
          box-sizing: border-box;
          position: relative;
      }
      .main::after{
          content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-width: 10px;
        border-style: solid;
        border-color: #673ab7 transparent transparent transparent;
      }
      .marker{
          max-width: 100%; 
          display: flex;
      }
      
      .image{
          background-color: none;
          border-radius: 5px;
          width: 40px;
          height: 100%;
          margin-right: 5px;
          flex: 1;
      }
      
      .image img{
          width: 100%;
          height: 100%;
          object-fit: fill;
          border-radius: 5px;
      }
      
      .info{
          /* background-color: aquamarine; */
          height: 100%;
          width: 100%;
          display: flex;
          flex: 2;
          flex-grow: 5;
          flex-direction: column;
          padding-left: 10px;
          color:#ffff;

      }
      .title{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
      }
        </style>
        <div class="marker" id='facilityMarker'>
        <div class="main">
          <div class="image">
          <img src=${facility.fileUrl.toString()} alt="Profile Image">
          </div>
          <div class="info">
            <div class="title">${facility.facilityName}</div>
            <div class="contant">&#127970;No.Of Levels:${facility.total_Levels}</div>
          </div>
        </div>
      </div>      
        `,
      }
      this.facilitymarker= new maptalks.ui.UIMarker(facility.facilitylocation.coordinates,customoptions);
      this.facilitymarker.addTo(this.map).show();
    
      this.facilitymarker.on('click',(e:any)=>{
        this.facilityName=e.target.options.name;
        this.sitemarker.setContent('');
        this.siteonboarding.obtainedLevelDetails.subscribe((data:any)=>{
          if(data){
            data.forEach((lvl:any,j:any) => {
                if(lvl.Facility_Id==e.target.options.id){
                  this.selectedLevels.push(data[j]);
                }
            });
        
          }
        });
        this.levelName=this.selectedLevels[0].levelName;
        this.getpolygonsdata(e.target._coordinate);
       
       (document.getElementById('facilityMarker')as HTMLElement).style.display ='none';
      this.facilitymarker.remove();
      })
    });
    this.map.animateTo({
      center: facilities[0].facilitylocation.coordinates,
      zoom: 18,
      pitch: 35,
      bearing: 0
    }, {
      duration: 3000
    });
    
  }
  opentoster(message:any,duration:any){
    this.snackBar.open(message, "close", {
      duration: duration,
      verticalPosition: 'top'
 
  })
    }
  getspaceIdsbyId(levelId:any,altitude:any){
    this.Devicescentroid=[];
    this.showicons=true;
    this.centeroid.features=[];
    console.log(levelId);
      this.siteonboarding.getSpacesbyId(levelId).subscribe((responce:any)=>{
        if(responce){
          responce.forEach((space:any) => {
              let obj:any={};
              obj['type']= "Feature",
              obj['properties']={
                Altitude:altitude,
                spaceName:space.spaceName,
                spaceId:space.spaceId,
                levelId:space.Level_Id
              },
              obj['geometry']=space.spacelocation

              this.centeroid.features.push(obj);
              if(space.Devices.lenght!=0){
                space.Devices.forEach((device:any) => {
                  this.Devicescentroid.push(device)
                });
                
              }
          });
          this.addSpacenamestomap(altitude,levelId)
        }
      });
       
      this.layer.getGeometries().forEach((geo:any,index:any) => {
       if((geo.type =='Polygon' || geo.type =="Point") &&  geo.properties.levelId !== levelId){
          this.layer.getGeometries()[index].setOptions({visible:false})
        }
      });
  }
  addSpacenamestomap(alt:any,lvlId:any){
    this.centeroid.features.forEach((item:any,i:any) => {
        this.layer.setOptions({enableAltitude:true}).addGeometry(new maptalks.Marker(
          item.geometry.coordinates, {
             symbol : [
                    {
                      
                      'markerWidth'  : 18,
                      'markerHeight' : 20
                    },
                    {
                      'textFaceName' : 'sans-serif',
                      'textName' : '{name}',
                      'textSize' : 9,
                      'textFill' : 'black',
                      'markerFillOpacity' : 1,
                      'textDy'   : 5
                    }
                  ],
            properties: {
              id : item.properties.spaceId,
              levelId:item.properties.levelId,
              name : item.properties.spaceName,
              altitude: item.properties.Altitude,
              visible: true,
            }
          }
        ))
    });
    this.Devicescentroid.forEach((device:any) => {
      let object:any={};
      object['type']= "Feature",
      object['properties']={
        Altitude:alt,
        spaceId:device.Space_Id,
        levelId:lvlId,
        deviceType:device.deviceType

      },
      object['geometry']=device.devicelocation
      this.Devicegeojson.features.push(object)
    });
    console.log(this.Devicegeojson);
    this.plottingdeviceMarkers()
  }

  plottingdeviceMarkers(){
    console.log(this.Devicegeojson)
    this.Devicegeojson.features.forEach((devices:any) => {
      console.log(devices,"device objects");
      var imageMarker:any="";
      if(devices.properties.deviceType == "Occupency"){
        imageMarker="https://storagesmartroute27.blob.core.windows.net/filesupload/Markers/icons8-user-groups-80.png";
      }else if(devices.properties.deviceType == "IAQ"){
        imageMarker="https://storagesmartroute27.blob.core.windows.net/filesupload/Markers/IAQ.png";

      }
      else if(devices.properties.deviceType == "IoT Cam"){
        imageMarker="https://storagesmartroute27.blob.core.windows.net/filesupload/Markers/camera marker.png";

      }
      else if(devices.properties.deviceType == "Router"){
        imageMarker="https://storagesmartroute27.blob.core.windows.net/filesupload/Markers/icons8-router-50.png";

      }
      this.layer.setOptions({enableAltitude:true}).addGeometry(
       
        new maptalks.Marker(
          devices.geometry.coordinates,
          {
            'symbol' : [{
              'markerFile'   : imageMarker,
              'markerWidth'  : 40,
              'markerHeight' : 30,
              'markerDx'     : 0,
              'markerDy'     : 0,
              'markerOpacity': 1,
              'markerRotation' : 0
            },
            {
              'textFaceName' : 'sans-serif',
              'textName' : '{deviceType}',
              'textSize' : 10,
              'textDy'   : 14
            }],
            properties: {
              id : devices.properties.spaceId,
              levelId:devices.properties.levelId,
              deviceType : devices.properties.deviceType,
              altitude: devices.properties.Altitude,
              
            }
          }
        ).setOptions({visible:false})
      )
    });
  }
  getpolygonsdata(center:any){
    let links:any='';
    function sortFunction(a,b){  
      var dateA = new Date(a.createdAt).getTime();
      var dateB = new Date(b.createdAt).getTime();
      return dateA > dateB ? 1 : -1;  
  }; 
  this.selectedLevels.sort(sortFunction);
  console.log(this.selectedLevels,"this.selectedLevels")

    this.selectedLevels.forEach((element:any,l:any) => {
        if(element.fileUrl.includes('.geojson')){
          links=this.selectedLevels[l].fileUrl;
        }else{
           links = `https://storagesmartroute27.blob.core.windows.net/filesupload/${this.sitename}/${this.facilityName.replace(/\s+/g, '')}/${element.levelName.replace(/\s+/g, '')}/geojson/${element.levelName.replace(/\s+/g, '')+'.'+'geojson'}`;
        
        }
        this.createpolygons(links,l)
        
        this.map.animateTo({
          center: center,
          zoom: 20.5,
          pitch: 55,
          bearing: 0
        }, {
          duration: 1000
        })
        this.facilitymarker.remove();
    });
  }
  createpolygons(links:any,l:any){
    console.log(links);
    this.http.get(String(links)).subscribe((response:any) => {
      this.showRefresh=true
      console.log(response,"geojson data");
      var coordinates:any
      response.features.forEach((item:any) => {
       if(item.geometry.type=="Polygon"){
        coordinates=item.geometry.coordinates
      }else if(item.geometry.type=="MultiPolygon"){
        coordinates=item.geometry.coordinates[0][0]
      }

        this.layer.setOptions({enableAltitude:true}).addGeometry( new maptalks.Polygon(coordinates, {
            visible: true,
            editable: true,
            cursor: "pointer",
            draggable: false,
            dragShadow: false, // display a shadow during dragging
            drawOnAxis: null, // force dragging stick on a axis, can be: x, y
            symbol: {
              lineColor: "#34495e",
              lineWidth: 0.5,
              polygonFill: "rgb(135,196,240)",
              polygonOpacity: 0.6,
            },
            properties: {
              id: item.properties.levelId,
              levelId:item.properties.levelId,
              name: item.properties.levelId,
              altitude: l* 4,
              visible: true,
            },
          }).on('click',(e)=>{
            console.log(e);
            this.focuspoint=e.coordinate
            this.getspaceIdsbyId(e.target.properties.id,e.target.properties.altitude);              
            this.map.animateTo({
              center: e.coordinate,
              zoom: 23,
              pitch: 0,
              bearing: 0
            }, {
              duration: 1000
            })
            this.map.removeBaseLayer();
          }).on('contextmenu',(e)=>{
           console.log(e)
            this.layer.getGeometries().forEach((geo:any,index:any) => {
              if((geo.type =="Point") &&  (geo.properties.deviceType)){
                this.layer.getGeometries()[index].setOptions({visible:false})
              }
              else if(geo.type =="Polygon"){
                geo.setOptions({visible:true})
              }
             
            });
            this.map.animateTo({
              center: e.coordinate,
              zoom: 21,
              pitch: 55,
              bearing: 0
            }, {
              duration: 1000
            })
          })
          
          )
        
      });
    });
  }
  getAllLevels(){
    this.siteonboarding.getAllLevels().subscribe((response:any)=>{
      if(response){
      this.siteonboarding.saveAllLevelDetails(response);
      }
    });
  }
  getAllFacilities(){
    this.siteonboarding.getAllFacilities().subscribe((response:any)=>{
      if(response){
      this.siteonboarding.saveAllFacilityDetails(response);
      }
    });
  }
  refreshpage(event:any){
    this.map.removeLayer('vector')
    this.ngOnInit();

  }
 openDailog(event:any){
  this.dialog.open(AddbuildingpopupComponent, {
    closeOnNavigation: true,
    autoFocus: true,
    data: event,
    // position:{
    //   left: '0px',
    //   top:'0px'
    // }
  });
 }
 showOccupency(){
    this.layer.getGeometries().forEach((geo:any,i:any) => {
      if((geo.type =="Point") && (geo.properties.deviceType &&  geo.properties.deviceType == "Occupency" )){
        this.layer.getGeometries()[i].setOptions({visible:true})
      }
      else if(geo.type =="Point" && (geo.properties.deviceType &&  geo.properties.deviceType !== "Occupency" )){
        this.layer.getGeometries()[i].setOptions({visible:false})
      }
    });
    this.map.animateTo({
      center: this.focuspoint,
      zoom: this.map.getZoom()-1,
      pitch: 0,
      bearing: 0
    }, {
      duration: 1000
    })
 }
 showIAQ(){
  this.layer.getGeometries().forEach((geo:any,i:any) => {
    if((geo.type =="Point") && (geo.properties.deviceType && geo.properties.deviceType == "IAQ")){
      this.layer.getGeometries()[i].setOptions({visible:true})
    }
   else if((geo.type =="Point") && (geo.properties.deviceType && geo.properties.deviceType !== "IAQ")){
      this.layer.getGeometries()[i].setOptions({visible:false})
    }
  });
  this.map.animateTo({
    center: this.focuspoint,
    zoom: this.map.getZoom()+1,
    pitch: 0,
    bearing: 0
  }, {
    duration: 1000
  })
 }
 showCameras(){
  this.layer.getGeometries().forEach((geo:any,i:any) => {
    if((geo.type =="Point") &&  (geo.properties.deviceType && geo.properties.deviceType == "IoT Cam")){
      this.layer.getGeometries()[i].setOptions({visible:true})
    }
    else if((geo.type =="Point") &&  (geo.properties.deviceType && geo.properties.deviceType !== "IoT Cam")){
      this.layer.getGeometries()[i].setOptions({visible:false})
    }
  });
  this.map.animateTo({
    center: this.focuspoint,
    zoom: this.map.getZoom()-1,
    pitch: 0,
    bearing: 0
  }, {
    duration: 1000
  })
 }
 showRouters(){
  this.layer.getGeometries().forEach((geo:any,i:any) => {
    if((geo.type =="Point") &&  (geo.properties.deviceType && geo.properties.deviceType == "Router")){
      this.layer.getGeometries()[i].setOptions({visible:true})
    }
    else if((geo.type =="Point") &&  (geo.properties.deviceType && geo.properties.deviceType !== "Router")){
      this.layer.getGeometries()[i].setOptions({visible:false})
    }
  });
  this.map.animateTo({
    center: this.focuspoint,
    zoom: this.map.getZoom()+1,
    pitch: 0,
    bearing: 0
  }, {
    duration: 1000
  })
 }
}
