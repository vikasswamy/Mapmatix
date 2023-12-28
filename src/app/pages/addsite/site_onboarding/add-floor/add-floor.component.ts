import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { FilesService } from 'src/app/pages/addbuildingpopup/files.service';
import { SiteonboardingService } from 'src/app/pages/addbuildingpopup/siteonboarding.service';
import { MaplocationService } from 'src/app/services/maplocation.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-floor',
  templateUrl: './add-floor.component.html',
  styleUrls: ['./add-floor.component.scss'
  ]
})
export class AddFloorComponent implements OnInit {
  fileType: any;
  picturesList: any = [];
  sas = "sp=racwdli&st=2023-12-08T10:41:34Z&se=2025-09-04T18:41:34Z&spr=https&sv=2022-11-02&sr=c&sig=vCsc0ekXq6WQgRR%2BCzjy%2FWwhFSe%2BAZ7%2BF%2Byiv5lO%2BEw%3D";
  picturesDownloaded: string[] = [];
  filename: string;
  fileName: string;
  form = {
    siteId: '',
    facilityId: '',
    levelName: '',
    fileUrl: '',
  };
  facilityName: string;
  allFacilities: any = [];
  sitesData: any = [

  ]
  facilityData: any = [

  ]
  selectedfile: any={};
  responceFacilityId: any;
  constructor(private http: HttpClient,public snackBar: MatSnackBar, private router: Router, private blobService: FilesService, private siteonboarding: SiteonboardingService, private maplocationservice: MaplocationService, public dialog: MatDialog
  ) {
    this.maplocationservice.addFacilityData.subscribe((data: any) => {
      console.log("In add floor component/constructor")
      this.form.siteId = data.siteId;
      this.form.facilityId = data.facilityName;
      this.form.levelName = data.levelName;
      this.form.fileUrl = data.fileUrl;

    })
  }

  ngOnInit(): void {
    this.getSites();
    this.getFacilities();

  }

  handleFileSelect(file:File){
   
  }

  public fileUpload(file: File) {
    this.fileName = file.name
    this.fileType = file.name.split(".")[1];

    if(this.fileType !=="geojson"){
      const formData = new FormData();
      formData.append('file', file);
      
      this.picturesList = [];
      if (this.fileName) {
        this.blobService.uploadImage(this.sas, file, this.facilityName.replace(/\s+/g, '')+"/"+this.form.levelName.replace(/\s+/g, '')+ "/" + this.fileType + "/" + file.name, () => {
        });
        this.reloadImages();
      }
    }else if(this.fileType ==="geojson"){
      const fileReader:any = new FileReader();
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = () => {
       this.selectedfile=JSON.parse(fileReader.result);
       console.log(this.selectedfile);
       this.form.fileUrl = `https://storagesmartroute27.blob.core.windows.net/filesupload/${this.facilityName.replace(/\s+/g, '')}/${this.form.levelName.replace(/\s+/g, '')}/${this.fileType}/${this.fileName}`;
      }
      fileReader.onerror = (error) => {
        console.log(error);
      }
    }
   


  }
  download(content:any, fileName:any, contentType:any) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    const formData = new FormData();
    formData.append('file', file);
    if (this.fileName) {
      this.blobService.uploadImage(this.sas, file, this.facilityName.replace(/\s+/g, '') + "/"+ this.form.levelName.replace(/\s+/g, '')+"/" + this.fileType + "/" + this.fileName, () => {
      });
      this.reloadImages();
    }
    //a.click();

  }
  onDownload(editedgeojso:any){
    console.log(editedgeojso,"editedgeojson");
    this.download(JSON.stringify(editedgeojso), this.form.levelName.replace(/\s+/g, '')+".geojson", "text/plain");
    
  }
  private reloadImages() {
    this.blobService.listImages(this.sas).then((list) => {
      if(list){
        this.form.fileUrl = `https://storagesmartroute27.blob.core.windows.net/filesupload/${this.facilityName.replace(/\s+/g, '')}/${this.form.levelName.replace(/\s+/g, '')}/${this.fileType}/${this.fileName}`;
      }
      
    });

  }
 
  redirect() {
    console.log(this.form,"in add level after adding new level")

    this.router.navigate(['createspaces/3'])
  }
  getSites() {
    this.siteonboarding.obtainedSiteDetails.subscribe((data: any) => {
      this.sitesData = data
    })
  }
  getFacilities() {
    this.allFacilities = [];
    this.siteonboarding.obtainedFacilityDetails.subscribe((data: any) => {
      this.allFacilities = data
    })
  }
  selectedSite(value: any) {
    this.facilityData = [];
    this.facilityName = null;
    console.log(value, this.allFacilities)
    this.facilityData = this.allFacilities.filter((ele: any, index: any) => { return ele.Site_Id == value });
    this.facilityName = this.facilityData[0].facilityName;
  }
  selectedFacility(value: any) {
    let selectedObj = this.facilityData.filter((ele: any) => { return ele.facilityId == value });

    let coordinates: any = selectedObj[0].facilitylocation.coordinates;

    this.maplocationservice.setFacilitylocation(coordinates);
  }
  onSubmit(): void {
    
    console.log(this.form,"::::::form data:::::");
    this.siteonboarding.addLevel(this.form).subscribe((response:any)=>{
      if(Object.entries(response).length>0){

        console.log(this.selectedfile.features,"this.selectedfile.features");
        this.selectedfile.features?this.getAllLevels():this.siteonboarding.selectedtab=3
          
        this.snackBar.open("Done", "close", {
          duration: 3000,
          verticalPosition: 'top'
     
      })
        let url:any=response.fileUrl.toString();
          this.responceFacilityId = response.Facility_Id
       
        this.maplocationservice.addLevelValues([response]);

        

      }else{
        this.snackBar.open("Failed", "Retry", {
          duration: 3000,
          verticalPosition: 'top'
     
      })
      }
    })
  }
  getAllLevels(){
    this.siteonboarding.getAllLevels().subscribe((response:any)=>{
      if(response){
        this.siteonboarding.saveAllLevelDetails(response);
        let filtedobjs:any
          filtedobjs = response.filter((ele: any, index: any) => { return ele.Facility_Id === this.responceFacilityId && ele.levelName== this.form.levelName });
          console.log(this.selectedfile.features.length,":::length of features:::");
         if(this.selectedfile.features.length>0){
          this.selectedfile.features.forEach((obj:any,i:any) => {
            if(obj.properties){
              obj.properties.levelId = filtedobjs[0].levelId;
            }else if(obj.properties ==null ){
              obj.properties={
                levelId : filtedobjs[0].levelId
              }
            }
            if(i == this.selectedfile.features.length-1){
              this.onDownload(this.selectedfile);
              this.siteonboarding.selectedtab=3
            }
            });
         }
             
           
            
      }
      
    });
   
  }

  onReset(form: NgForm): void {
    form.reset();
  }


}
