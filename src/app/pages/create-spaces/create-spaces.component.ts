import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import * as L from 'leaflet';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { FilesService } from 'src/app/pages/addbuildingpopup/files.service';

import * as maptalks from "maptalks";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import * as moment from "moment";
import { distinctUntilChanged, filter, startWith } from "rxjs/operators";
import { fromEvent, Subscription } from 'rxjs';

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
import { AddsiteComponent } from '../addsite/addsite.component';
import { MaplocationService } from 'src/app/services/maplocation.service';
import { AddDeviceComponent } from '../addsite/site_onboarding/add-device/add-device.component';
import { chmodSync } from 'fs';
@Component({
  selector: 'app-create-spaces',
  templateUrl: './create-spaces.component.html',
  styleUrls: ['./create-spaces.component.scss']
})
export class CreateSpacesComponent implements OnInit {
  map: any;
  isUserAllowedFurter: boolean = true;

  markerLocations = [
    {
      lat: 38.914764662971436,
      lng: -97.01461108304595
    },
     {
       lat: 2,
       lng: 2
     }
  ];
  subscription: Subscription;
  sampleGeojson:any={
    type: "FeatureCollection",
    features: []
  } 
  spacecentroid :any = {
    type:"FeatureCollection",
    features:[]
  } 
  sas = "sp=racwdli&st=2023-12-08T10:41:34Z&se=2025-09-04T18:41:34Z&spr=https&sv=2022-11-02&sr=c&sig=vCsc0ekXq6WQgRR%2BCzjy%2FWwhFSe%2BAZ7%2BF%2Byiv5lO%2BEw%3D";
  showupload:boolean=false
  routeparams:any;
  facilityLocation:any=[];
  selecteddrawToolOption:any;
  formelement: any;
  longitude:any;
  latitude:any;
  formdata: any;
  point:any;
  siteName: any;
  levelName: any;
  facilityName: any;
  fileName: string;
  fileType: string;
  picturesList: any[];
  formpayload: any=[];
  Facility_Id: any;
  Site_Id: any;
  Level_Id: any;
  geojsonLink: any;
  drawToolitems: any=[];
  loader: boolean=true;
  constructor(public snackBar: MatSnackBar, private http: HttpClient, private route: ActivatedRoute, private siteonboarding: SiteonboardingService, private blobService: FilesService,public dialog: MatDialog, private maplocationservice: MaplocationService) {  
    this.routeparams = this.route.snapshot.paramMap.get('id');
    //if(this.routeparams == 3 || this.routeparams == 4){
      this.formelement = AddDeviceComponent;
      this.maplocationservice.locateFacility.subscribe((location:any)=>{
        this.facilityLocation=location
      });
      this.maplocationservice.addlevelData.subscribe((data:any)=>{
        this.Facility_Id = data[0].Facility_Id;
          this.Site_Id  = data[0].Site_Id;
          this.Level_Id = data[0].levelId
          this.levelName = data[0].levelName;
        this.formdata=data;
      })
    //}
  }
  panelOpenState = true;

  accordions = [
   
  ];
  
  
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.accordions, event.previousIndex, event.currentIndex);
  }
  ngOnInit() {
    this.getSpaces();

    var polygons:any=[];
  
    this.siteonboarding.obtainedLevelDetails.subscribe((data: any) => {
      data.forEach((ele:any,i:any)=>{
        if(ele.levelId == this.formdata[0].levelId){
          this.Level_Id = data[i].levelId
          this.levelName = data[i].levelName;
        }
      })
    });
    this.siteonboarding.obtainedFacilityDetails.subscribe((data: any) => {
       data.forEach((ele:any,j:any)=>{
        if(ele.facilityId == this.formdata[0].Facility_Id
          ){
            this.facilityName= data[j].facilityName;
        }
      })
    });
    this.siteonboarding.obtainedSiteDetails.subscribe((sitedata:any)=>{
      sitedata.forEach((ele:any,k:any) => {
        if(ele.siteId == this.formdata[0].Site_Id){
          this.siteName = sitedata[k].siteName;
        } 
      });
    })
   var changeImagesize:any;
    let mapZoom:any= this.facilityLocation.length == 0 ? 0 : 24 ;
    let mapcenter = this.facilityLocation.length == 0 ? [-24, 42] :this.facilityLocation ;
     var map: any = null;
       map = new maptalks.Map("createspace", {
      center:mapcenter,
      zoom: mapZoom,
      
       minZoom: 2,
      pitch: 6,
      layerSwitcherControl: {
        'position'  : {'top': '20', 'right': '750'},
        // title of base layers
        
        'baseTitle' : 'Base Layers',
        // title of layers
        'overlayTitle' : 'Layers',
        'repeatWorld' :false,
        'excludeLayers' : ['vector'],
        // css class of container element, maptalks-layer-switcher by default
        'containerClass' : 'maptalks-layer-switcher'
      },
      baseLayer: new maptalks.GroupTileLayer('Base TileLayer', [
       
        new maptalks.TileLayer('Carto light',{
          'visible' : true,
          repeatWorld :false,
          'urlTemplate': 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          'subdomains'  : ['a','b','c','d']
        }),
        
        new maptalks.TileLayer('Satellite',{
          'visible' : false,
          repeatWorld :false,
          'urlTemplate': 'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
          subdomains: ['mt0','mt1','mt2','mt3'],
          attribution:
          '© <a href="http://osm.org">OpenStreetMap</a>  contributors, © <a href="https://carto.com/">CARTO</a> ',
        })
      ])
     
      
    });
   
    var layer:any = new maptalks.VectorLayer('vector').setOptions({
      editable : true,
    }).addTo(map);
    
    this.siteonboarding.obtainedspaceDetails.subscribe((data:any)=>{
      map.getLayers().forEach((geo:any) => {
        geo._geoList.forEach((items:any,index:any) => {
          if(items._jsonType=="Marker" && items.options.id){
            geo._geoList[index].remove()
          }
        });
      })
      if(data){
        data.forEach((itm:any,i:any) => {
            maptalks.GeoJSON.toGeometry(itm).setOptions({id:this.levelName}).addTo(map.getLayer('vector')).bringToFront().on('click', function (e) {
              if(itm.properties.spaceId == e.target.properties.spaceId){
                self.siteonboarding.saveAllDeviceDetails([data[i]])
              }
              self.opendialog()
            })
        });
      }
      
      //maptalks.GeoJSON.toGeometry(data).addTo(map.getLayer('v'));
    })
    this.maplocationservice.polygongeojson.subscribe((data:any)=>{
      map.getLayers().forEach((geo:any) => {
        geo._geoList.forEach((items:any,index:any) => {

          if(items._jsonType=="Polygon"){
            geo._geoList[index].remove()
          }
        })
      })
      if(data[0]){
        this.loader = false
        data[0].features.forEach((poly:any) => {
            layer.addGeometry(poly)
        });
        if(data[0].features.lenght==0){
          this.showupload=false;
        }
      }
    })
    let imageurl :any='';
    
    if(this.formdata.fileUrl && !this.formdata[0].fileUrl.includes('.geojson') ){
      imageurl= this.formdata.fileUrl.includes('.geojson')==false ?this.formdata.fileUrl:'';
      this.geojsonLink= `https://storagesmartroute27.blob.core.windows.net/filesupload/${this.siteName}/${this.facilityName.replace(/\s+/g, '')}/${this.levelName.replace(/\s+/g, '')}/geojson/${this.levelName.replace(/\s+/g, '')+'.'+'geojson'}`;

      this.drawToolitems=['Point', 'LineString', 'Polygon', 'Circle', 'Ellipse', 'Rectangle', 'FreeHandLineString', 'FreeHandPolygon']
    }else if(this.formdata[0].fileUrl && !this.formdata[0].fileUrl.includes('.geojson')){
      imageurl=this.formdata[0].fileUrl.includes('.geojson')==false ? this.formdata[0].fileUrl :'';
      this.geojsonLink= `https://storagesmartroute27.blob.core.windows.net/filesupload/${this.siteName}/${this.facilityName.replace(/\s+/g, '')}/${this.levelName.replace(/\s+/g, '')}/geojson/${this.levelName.replace(/\s+/g, '')+'.'+'geojson'}`;

      this.drawToolitems=['Point', 'LineString', 'Polygon', 'Circle', 'Ellipse', 'Rectangle', 'FreeHandLineString', 'FreeHandPolygon']

    }
    else if(this.formdata[0].fileUrl.includes('.geojson')){
      this.geojsonLink = this.formdata[0].fileUrl;
      this.drawToolitems=['Point']

    }else if(!this.formdata[0].fileUrl.includes('.geojson')){
      this.geojsonLink= `https://storagesmartroute27.blob.core.windows.net/filesupload/${this.siteName}/${this.facilityName.replace(/\s+/g, '')}/${this.levelName.replace(/\s+/g, '')}/geojson/${this.levelName.replace(/\s+/g, '')+'.'+'geojson'}`;
      this.drawToolitems=['Point']

    }
    this.getpolygonsdata();

    this.point = new maptalks.Marker(
      this.facilityLocation,
      {
        visible : true,
        editable : true,
        cursor : 'pointer',
        draggable : false,
        dragShadow : false, // display a shadow during dragging
        drawOnAxis : null,  // force dragging stick on a axis, can be: x, y
        symbol : {
          'markerFile'   : imageurl,
            'markerWidth'  :  200,
            'markerHeight' :  100,
            'markerDx'     : 0,
            'markerDy'     : 0,
            'markerOpacity': 1
        },
        properties: {
          id:this.levelName
        }
      }
    );
    if(imageurl)  {
      new maptalks.VectorLayer('customimage', this.point,{
        enableAltitude: true
      }).addTo(map);
    
    }
  

    map.on("zoomend ",()=>{
      changeImagesize=map.getZoom();
      if(changeImagesize > 21){
        this.point.updateSymbol({
          markerWidth : 400,
          markerHeight: 300
      })
      }else if(changeImagesize <= 21){
        this.point.updateSymbol({
          markerWidth : changeImagesize*10,
          markerHeight: changeImagesize*5
      })
      }
      this.point.updateSymbol({
        markerWidth : changeImagesize*10,
        markerHeight: changeImagesize*5
    });
      })
    //this.startEdit()
      var self:any=this;
    var drawTool = new maptalks.DrawTool({
      mode: 'Point',
    }).addTo(map).disable();
    
    drawTool.on('drawend', function (param) {
      let obtainedGeojson:any = JSON.stringify(param.geometry.toGeoJSON());
        let parsedObject:any = JSON.parse(obtainedGeojson)
        parsedObject.properties={
          spacename:'',
          levelId:self.Level_Id
        }
        self.selecteddrawToolOption=parsedObject.geometry.type;
      if(parsedObject.geometry.type=="Point"){
        param.geometry.setOptions({id:self.levelName})
       
        self.accordions.push(
          {
            facilityName: self.facilityName,
            levelName: self.levelName,
            subAccordion: [{
              Facility_Id:self.Facility_Id,
              Level_Id:self.Level_Id,
              Site_Id:self.Site_Id,
              spaceName: '',
              spaceType: '',
              capacity:0,
              spacelocation: JSON.stringify(parsedObject),
            }]
          }
        )
        self.spacecentroid.features.push(parsedObject);

      }else{
        
        self.showupload=true;
        self.sampleGeojson.features.push(parsedObject)
      }

      // obtainedGeojson.properties={
      //   SpaceName:"",
      //   Base_hight:0,
      //   Height:0,
      //   width:0,
      //   SpaceType:"",

      // }
      
      layer.addGeometry(param.geometry);
      
      

    });
    map.getLayer('vector').bringToFront();
  
    var selectedtype:any=''
    var items = this.drawToolitems.map(function (value) {
      return {
        item: value,
        click: function () {
          
          drawTool.setMode(value).enable();
        }
      };
    });

    var toolbar = new maptalks.control.Toolbar({
      items: [
        {
          item: 'Shape',
          children: items
        },
        {
          item: 'Disable',
          click: function () {
            drawTool.disable();
          }
        },
        {
          item: 'Clear',
          click: function () {
          
           
            //
            if(self.selecteddrawToolOption=="Point"){
             
              self.spacecentroid.features.splice(-1, 1);
              self.accordions.splice(-1,1)
              self.siteonboarding.saveAllSpaceDetails(self.spacecentroid.features);
              self.accordions.splice(-1,1)
            }else{
              self.sampleGeojson.features.splice(-1, 1);
              self.maplocationservice.addpolygondata([self.sampleGeojson])
            }
          
          }
        }
      ]
    }).addTo(map);
    
    const keyDowns:any = fromEvent(document, 'keydown').pipe(
      filter((e: KeyboardEvent) => e.keyCode === 27),
      distinctUntilChanged()
    );
    this.subscription = keyDowns.subscribe(escpress => {
      if (escpress.type === 'keydown') {
        drawTool.disable();

      }
    });

   }
   getpolygonsdata(){
    this.loader = true;
    this.http.get(String(this.geojsonLink)).subscribe((response:any) => {
        if(response){
          this.loader = false;
          this.sampleGeojson.features=[];
          response.features.forEach((item:any) => {
           this.sampleGeojson.features.push(item)         
          
          });
      
          this.maplocationservice.addpolygondata([this.sampleGeojson])

        }
        
        //this.point.addGeometry(polygons)
    })
   }
   getSpaces(){
    this.siteonboarding.getAllSpaces().subscribe((data:any)=>{
      if(data){
        let arr:any=[]
        data.forEach((element:any,i:any) => {
          let obj:any ={};
          if(element.Level_Id == this.Level_Id){
            
            obj['type']= "Feature";
            obj["geometry"]=data[i].spacelocation;
            obj["properties"]={
              "spaceName":data[i].spaceName,
              "spaceType":data[i].spaceType,
              "spaceId":data[i].spaceId,
              'Site_Id':data[i].Site_Id,
              "Facility_Id":data[i].Facility_Id,
              "Level_Id":data[i].Level_Id
            }
           arr.push(obj);
            //this.spacecentroid.features.push(obj);
            
          }
          

        });
        this.siteonboarding.saveAllSpaceDetails(arr)
      }
    })
   }
   deleteItem(event: any, pannel: any, Index: any) {
    
    this.accordions.splice(Index-1,1)
   }
   opendialog(){
    // this.formdata.lng=this.longitude;
    // this.formdata.lat= this.latitude;

     this.dialog.open(this.formelement, {
        closeOnNavigation: true,
        autoFocus: true,
        data: event,
        //disableClose: true,
        position:{
          right: '100px',
          top:'50px'
        }
      });
    }
   public fileUpload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    this.fileName = file.name
    this.fileType = file.name.split(".")[1];
    if (this.fileName) {
      this.blobService.uploadImage(this.sas, file, this.facilityName + "/" + this.levelName + "/" + this.fileType + "/" + file.name, () => {
      });
      this.reloadImages();
    }


  }
  private reloadImages() {
    this.blobService.listImages(this.sas).then((list) => {
      if(list){
        this.snackBar.open("File/data saved successfully", "close", {
          duration: 3000,
          verticalPosition: 'top'
     
      })
       this.getpolygonsdata()
      }
    });

  }

   startEdit() {
    this.point.startEdit();
  }
  endEdit() {
    this.point.endEdit();
  }
  download(content:any, fileName:any, contentType:any) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    const formData = new FormData();
    formData.append('file', file);
    this.fileName = fileName
    this.fileType = fileName.split(".")[1];
    if (this.fileName) {
      this.blobService.uploadImage(this.sas, file,this.siteName+'/'+ this.facilityName.replace(/\s+/g, '') + "/" + this.levelName.replace(/\s+/g, '') + "/" + this.fileType + "/" + fileName, () => {
      });
      this.reloadImages();
    }
    //a.click();

  }
  onDownload(){
    this.download(JSON.stringify(this.sampleGeojson), this.levelName.replace(/\s+/g, '')+".geojson", "text/plain");
    this.showupload=true;
  }
  submitForm(params:any){
    this.siteonboarding.addSpaces(params).subscribe((response:any)=>{
      if(response.length>0){
        let arr:any=[];
          this.snackBar.open("Done", "close", {
            duration: 3000,
            verticalPosition: 'top'
       
        })
        this.accordions=[];
       this.getSpaces()
      }else{
        this.snackBar.open("Failed", "retry", {
          duration: 3000,
          verticalPosition: 'top'
     
      })
      }
     
    })
  }
  submitSpaces() {
    this.formpayload=[];
    this.accordions.forEach((item:any,index:any)=>{
      item.subAccordion.forEach((element:any) => {
            this.formpayload.push(element);
            if(index== this.accordions.length-1){
                this.submitForm(this.formpayload)
            }
      });

    });
   
    //this.formPayload.push()
  }
}
