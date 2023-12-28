import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SiteonboardingService } from 'src/app/pages/addbuildingpopup/siteonboarding.service';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss']
})
export class AddDeviceComponent implements OnInit {
  form = {
    Site_Id: '',
    Facility_Id: '',
    Levle_Id: '',
    Space_Id:'',
    deviceType:"",
    deviceId: '',
    devicelocation:'',
  };
  DevicesTypes:any=["Occupency","IAQ","IoT Cam","Router"]
  constructor(private siteonboarding: SiteonboardingService,public snackBar: MatSnackBar,public dialog: MatDialog) {
    this.siteonboarding.obtainedDeviceDetails.subscribe((data:any)=>{
        console.log(data,"add device component");
        this.form.Site_Id= data[0].properties.Site_Id;
        this.form.Facility_Id=data[0].properties.Facility_Id;
        this.form.Levle_Id=data[0].properties.Level_Id;
        this.form.Space_Id=data[0].properties.spaceId;
        this.form.devicelocation= JSON.stringify(data[0].geometry);
         })
   }

  ngOnInit(): void {
   
  }
  onSubmit(): void {

    //console.log(JSON.stringify(this.form, null, 2));
    this.siteonboarding.adddevices(this.form).subscribe((response:any)=>{
      console.log(response);
      if(Object.entries(response)){
        this.snackBar.open("Done", "close", {
          duration: 3000,
          verticalPosition: 'top'
     
      });
      this.dialog.closeAll();
      }else{
        this.snackBar.open("Failed", "Retry", {
          duration: 3000,
          verticalPosition: 'top'
     
      });
      }
    })
  
  }
  selectedDevice(value: any) {
    this.form.deviceType=value;
  }


  onReset(form: NgForm): void {
    form.reset();
  }
}
