import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as mapboxgl from "mapbox-gl";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from '@angular/forms';
import { MaplocationService } from 'src/app/services/maplocation.service';
import { SiteonboardingService } from '../addbuildingpopup/siteonboarding.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilesService } from '../addbuildingpopup/files.service';

@Component({
  selector: 'app-addsite',
  templateUrl: './addsite.component.html',
  styleUrls: ['./addsite.component.scss' ]
})
export class AddsiteComponent implements OnInit {
  showPortal = false;
  fileType: any;
  picturesList: any = [];
  sas = "sp=racwdli&st=2023-12-08T10:41:34Z&se=2025-09-04T18:41:34Z&spr=https&sv=2022-11-02&sr=c&sig=vCsc0ekXq6WQgRR%2BCzjy%2FWwhFSe%2BAZ7%2BF%2Byiv5lO%2BEw%3D";
  picturesDownloaded: string[] = [];
  filename: string;
  fileName: string;
  routeparams: any;
  form :any= {
    siteName: '',
    fileUrl:'',
    lan: 0,
    lat:0
  };
  constructor(public snackBar: MatSnackBar,private blobService: FilesService,public dialog: MatDialog, private router: Router,private route: ActivatedRoute,private locationservice: MaplocationService,private siteonboarding :SiteonboardingService
  ) { 
    this.locationservice.addSiteData.subscribe((data:any)=>{
          this.form.siteName=data[0].siteName
          this.form.fileUrl= data[0].fileUrl
           this.form.lan= data[0].lan;
           this.form.lat= data[0].lat;
          
    })
  }

  ngOnInit(): void {
   
  }
  public fileUpload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    this.fileName = file.name
    this.fileType = file.name.split(".")[1];
    this.picturesList = [];
    if (this.fileName) {
      this.blobService.uploadImage(this.sas, file, this.form.siteName.replace(/\s+/g, '')+"/"+ this.fileType + "/" + file.name, () => {
      });
      this.reloadImages();
    }


  }
  private reloadImages() {
    this.blobService.listImages(this.sas).then((list) => {
      if(list){
        this.form.fileUrl = `https://storagesmartroute27.blob.core.windows.net/filesupload/${this.form.siteName.replace(/\s+/g, '')}/${this.fileType}/${this.fileName}`;
      }
      
    });

  }
  onchangeSiteName(value:any){
    this.form.siteName=value
  }
  
  redirect(){

    this.locationservice.addsitevalues([this.form])
    this.router.navigate(['maptool/1'])
  }
  onSubmit(): void {
    console.log(this.form)
    this.siteonboarding.addSite(this.form).subscribe((response:any)=>{
      console.log(response,"add site responce");
      if(Object.entries(response).length>0){
        this.snackBar.open("Done", "close", {
          duration: 3000,
          verticalPosition: 'top'
     
      })
        this.dialog.closeAll();
        this.router.navigate(['map'])

      }else{
        this.snackBar.open("Failed", "Retry", {
          duration: 3000,
          verticalPosition: 'top'
     
      })
      }
    })
  }

  onReset(form: NgForm): void {
    form.reset();
  }
  
  


}
