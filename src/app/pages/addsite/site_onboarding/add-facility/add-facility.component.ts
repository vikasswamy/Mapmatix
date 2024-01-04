import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SiteonboardingService } from 'src/app/pages/addbuildingpopup/siteonboarding.service';
import { MaplocationService } from 'src/app/services/maplocation.service';
import { MatDialog } from '@angular/material/dialog';
import { FilesService } from 'src/app/pages/addbuildingpopup/files.service';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-facility',
  templateUrl: './add-facility.component.html',
  styleUrls: ['./add-facility.component.scss'
  ]
})
export class AddFacilityComponent implements OnInit {
  fileType: any;
  picturesList: any = [];
  sas = "sp=racwdli&st=2023-12-08T10:41:34Z&se=2025-09-04T18:41:34Z&spr=https&sv=2022-11-02&sr=c&sig=vCsc0ekXq6WQgRR%2BCzjy%2FWwhFSe%2BAZ7%2BF%2Byiv5lO%2BEw%3D";
  picturesDownloaded: string[] = [];
  lanlat:any;
  sitesData:any=[

  ]
  form = {
    siteId: '',
    facilityName:'',
    imageUrl:'',
    lan: 0,
    lat:0
    
  };
  filename: string;
  fileName: string;
  sitename: any;
  constructor(public dialog: MatDialog, private blobService: FilesService,public snackBar: MatSnackBar,
    private router: Router,private siteonboarding : SiteonboardingService,private maplocationservice : MaplocationService
  ) { 
    this.maplocationservice.addFacilityData.subscribe((data:any)=>{
            this.form.siteId=data[0].siteId;
            this.form.facilityName= data[0].facilityName;
            this.form.imageUrl = data[0].imageUrl;
           this.form.lan= data[0].lan;
           this.form.lat= data[0].lat;
           this.lanlat= data[0].lan+','+ data[0].lat
    })
  }

  ngOnInit(): void {
   this.getAllSites();
   //this.reloadImages();
  }
  public fileUpload(file: File) {
    let fileurl:any
    const formData = new FormData();
    formData.append('file', file);
    this.fileName = file.name
    this.fileType = file.name.split(".")[1];
    let facilityname= this.form.facilityName.replace(/\s+/g, '');
    console.log(facilityname)
    this.picturesList = [];
      if(this.form.facilityName){
        this.blobService.uploadImage(this.sas, file,this.sitename+'/'+facilityname+ "/"+this.fileType+"/"+ file.name, () => {
        });
        this.reloadImages();
      }
   
    
  }
  
  private reloadImages() {
    this.blobService.listImages(this.sas).then((list) => {
      this.form.imageUrl=`https://storagesmartroute27.blob.core.windows.net/filesupload/${this.sitename}/${this.form.facilityName.replace(/\s+/g, '')}/${this.fileType}/${this.fileName}`;
      list.push(`https://storagesmartroute27.blob.core.windows.net/filesupload/${this.sitename}/${this.form.facilityName.replace(/\s+/g, '')}/${this.fileType}/${this.fileName}`)
      list.forEach((ele:any)=>{
        let links = this.downloadThisBlob(ele, this.containerClient(this.sas));

      });
      console.log(this.form,"list")

    });
    
  }
  private containerClient(sas: string): ContainerClient {
    return new BlobServiceClient(
      `https://${this.blobService.picturesAccount}.blob.core.windows.net?${sas}`
    ).getContainerClient(this.blobService.picturesContainer);
  }

  private downloadThisBlob(name: string, client: ContainerClient) {
    const blobClient = client.getBlobClient(name);
    //let type = content.type;
    if (name.indexOf("geojson") >= 0) {
      blobClient.setHTTPHeaders({ blobContentType: "geojson" });
    } else {
      blobClient.setHTTPHeaders({
        blobContentType: "application/octet-stream",
      });
    }
    return blobClient.url;
  }
  selectedSite(value:any) {
    let siteObject:any=this.sitesData.filter((ele:any,index:any)=>{ return ele.siteId == value});
    this.sitename=siteObject[0].siteName;
    let coordinates:any = siteObject[0].location.coordinates;
    this.maplocationservice.setFacilitylocation(coordinates)
  }
  getAllSites(){
    console.log(":::loading  sites::::")
    this.siteonboarding.obtainedSiteDetails.subscribe((response:any)=>{
      console.log(response)
      if(response){
        this.sitesData=response;
        
      }
      console.log(this.sitesData,"siteData")
    })
  }
  redirect(){
    this.maplocationservice.addFacilityvalues([this.form]);
    this.router.navigate(['maptool/2'])
  }
  locationchange(event:any){
    console.log(event.target.value,"::::event.target.value:::");
    this.form.lan=event.target.value.split(',')[0];
    this.form.lat=event.target.value.split(',')[1];
    this.lanlat = event.target.value.split(',')[0]+','+event.target.value.split(',')[1]
  }
  onSubmit(): void {
    console.log(this.form)
    this.form.lan==0?this.lanlat.split(',')[0]:'';
    this.form.lat==0?this.lanlat.split(',')[1]:'';
    this.siteonboarding.addFacility(this.form).subscribe((response:any)=>{
      if(Object.entries(response).length>0){
        console.log(response,"add facility responce");
        this.snackBar.open("Done", "close", {
          duration: 3000,
          verticalPosition: 'top'
     
      })
        this.dialog.closeAll();
        this.router.navigate(['/map'])
      }else{
        this.snackBar.open("Failed", "retry", {
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
