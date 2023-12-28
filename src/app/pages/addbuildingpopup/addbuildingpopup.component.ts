import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SiteonboardingService } from './siteonboarding.service';

@Component({
  selector: 'app-addbuildingpopup',
  templateUrl: './addbuildingpopup.component.html',
  styleUrls: ['./addbuildingpopup.component.scss' ]
})
export class AddbuildingpopupComponent implements OnInit {
  public demo1TabIndex :any;
  constructor(public siteonboardingservice : SiteonboardingService) { 
  }
 
  ngOnInit(): void {
    
   this.demo1TabIndex= this.siteonboardingservice.selectedtab
  }
 
}
