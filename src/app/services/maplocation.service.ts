import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { shareReplay } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MaplocationService {
  private siteparams = new BehaviorSubject <any>([]);
  addSiteData = this.siteparams.asObservable();

  private facilityparams = new BehaviorSubject <any>([]);
  addFacilityData = this.facilityparams.asObservable();
  
  private facilityLocation = new BehaviorSubject <any>([]);
   locateFacility = this.facilityLocation.asObservable();
   
  private levelParams =new BehaviorSubject <any>([]);
  addlevelData = this.levelParams.asObservable();
  private polygondata = new BehaviorSubject <any>([]);
  polygongeojson = this.polygondata.asObservable();
  constructor() { }
  setFacilitylocation(data:any){
    this.facilityLocation.next(data)
  }
  addsitevalues(data:any){
    this.siteparams.next(data)
  }
  addFacilityvalues(data:any){
    this.facilityparams.next(data);
  }
  addLevelValues(data:any){
    this.levelParams.next(data);
  }
  addpolygondata(data:any){
    this.polygondata.next(data)
  }
}
