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
@Component({
  selector: 'app-add-space',
  templateUrl: './add-space.component.html',
  styleUrls: ['./add-space.component.scss'
  ]
})
export class AddSpaceComponent implements OnInit {

  fileType: any;
  picturesList: any = [];
  sas = "sp=racwdli&st=2023-12-08T10:41:34Z&se=2025-09-04T18:41:34Z&spr=https&sv=2022-11-02&sr=c&sig=vCsc0ekXq6WQgRR%2BCzjy%2FWwhFSe%2BAZ7%2BF%2Byiv5lO%2BEw%3D";
  picturesDownloaded: string[] = [];
  filename: string;
  fileName: string;
  form = {
    siteId: '',
    facilityId: '',
    levelId:'',
    fileUrl: '',
    spaceDetails:[],
  };
  facilityName: string;
  allFacilities: any = [];
  sitesData: any = [

  ]
  facilityData: any = [

  ]
  allLevels: any[];
  levelsData: any[];
  constructor(private http: HttpClient, private router: Router, private blobService: FilesService, private siteonboarding: SiteonboardingService, private maplocationservice: MaplocationService, public dialog: MatDialog
  ) {
    this.getLevels();

  }

  ngOnInit(): void {
    this.getSites();
    this.getFacilities();

  }

  public fileUpload(file: File) {
    let fileurl: any
    const formData = new FormData();
    formData.append('file', file);
    this.fileName = file.name
    this.fileType = file.name.split(".")[1];
    this.picturesList = [];
    // if (this.facilityName) {
    //   this.blobService.uploadImage(this.sas, file, this.facilityName + "/" + this.form.levelName.trim() + "/" + this.fileType + "/" + file.name, () => {
    //   });
    //   this.reloadImages();
    //}


  }
  private reloadImages() {
    this.blobService.listImages(this.sas).then((list) => {
      if(list){
        // this.form.imageUrl = `https://storagesmartroute27.blob.core.windows.net/filesupload/${this.facilityName}/${this.form.levelName.trim()}/${this.fileType}/${this.fileName}`;
        this.maplocationservice.addLevelValues(this.form);

      }
      
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
  redirect() {
    this.router.navigate(['createspaces/4'])
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
  getLevels(){
    this.siteonboarding.obtainedLevelDetails.subscribe((data: any) => {
      console.log(data,"in add space");
      this.allLevels = data;
    })
  }
  selectedSite(value: any) {
    this.facilityData = [];
    this.facilityName = null;
    console.log(value, this.allFacilities);
    this.facilityData = this.allFacilities.filter((ele: any, index: any) => { return ele.Site_Id == value });
    console.log(this.facilityData,"faciltity data")
    this.facilityName = this.facilityData[0].facilityName;
  }
  selectedFacility(value: any) {
    console.log(this.allLevels,"all levels")
    this.levelsData =[];
    this.levelsData = this.allLevels.filter((ele: any, index: any) => { return ele.Facility_Id == value });
    console.log(this.levelsData)
    let selectedObj = this.facilityData.filter((ele: any) => { return ele.facilityId == value });
    let coordinates: any = selectedObj[0].facilitylocation.coordinates;
    this.maplocationservice.setFacilitylocation(coordinates);
  }
  selectLevel(value:any){
    let selectedlevelObj = this.levelsData.filter((ele:any)=>{return ele.levelId == value});
    console.log(selectedlevelObj,"selectedlevelObj")
    this.maplocationservice.addLevelValues(selectedlevelObj)

  }
  onSubmit(): void {
    
    //console.log(JSON.stringify(this.form, null, 2));
    this.siteonboarding.addLevel(this.form).subscribe((response:any)=>{
      if(response){
        console.log(response,"add level responce");
        let url:any=response.fileUrl.toString();
        this.reloadImages()
        this.redirect();
        this.dialog.closeAll();

        this.http.get(url).subscribe((resp: any) => {
          console.log("trying to get uploaded image ");
         
          console.log(resp);
        
        })
        

      }
    })
  }

  onReset(form: NgForm): void {
    form.reset();
  }

}
