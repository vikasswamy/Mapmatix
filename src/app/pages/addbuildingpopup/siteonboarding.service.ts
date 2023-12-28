import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
// import { apiBaseURL } from "./auth-config";
import { shareReplay } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class SiteonboardingService {
  apiBaseUrl:any=`https://mapmatrixnodej-803097e9a651.herokuapp.com`;
  public selectedtab:any=0;
  constructor(private http: HttpClient) { }
  private sharedSiteDetails = new BehaviorSubject <any>([]);
  obtainedSiteDetails = this.sharedSiteDetails.asObservable();

  private SharedFacilityDtailes = new BehaviorSubject <any>([]);
  obtainedFacilityDetails = this.SharedFacilityDtailes.asObservable();

  private SharedLevelDtailes = new BehaviorSubject <any>([]);
  obtainedLevelDetails = this.SharedLevelDtailes.asObservable();

  private SharedSpaceeDetailes = new BehaviorSubject <any>([]);
  obtainedspaceDetails = this.SharedSpaceeDetailes.asObservable();


  private SharedDeviceDetailes = new BehaviorSubject <any>([]);
  obtainedDeviceDetails = this.SharedDeviceDetailes.asObservable();

  addSite(data:any){
    return this.http.post(
      this.apiBaseUrl + `/Sites`,
      data
    );
  }
  addFacility(data:any){
    return this.http.post(
      this.apiBaseUrl + `/Facilities`,
      data
    );
  }
  addLevel(data:any){
    return this.http.post(
      this.apiBaseUrl + `/Levels`,
      data
    );
  }
  addSpaces(data:any){
    return this.http.post(
      this.apiBaseUrl + `/Spaces`,
      data
    );
  }
  adddevices(data:any){
    return this.http.post(
      this.apiBaseUrl + `/Devices`,
      data
    );
  }
  getAllSites(){
    return this.http.get(
      this.apiBaseUrl+`/Sites`
    )
  }
  getAllFacilities(){
    return this.http.get(
      this.apiBaseUrl+`/Facilities`
    )
  }
  getAllLevels(){
    return this.http.get(
      this.apiBaseUrl+`/Levels`
    )
  }
  getAllSpaces(){
    return this.http.get(
      this.apiBaseUrl+`/Spaces`
    )
  }
  getSpacesbyId(Id:any){
    return this.http.get(
      this.apiBaseUrl+`/Spaces/byId/${Id}`
    )
  }
  saveAllsiteDetails(data:any){
    this.sharedSiteDetails.next(data);
  }
  saveAllFacilityDetails(data:any){
    this.SharedFacilityDtailes.next(data);
  }
  saveAllLevelDetails(data:any){
    this.SharedLevelDtailes.next(data);
  }
  saveAllSpaceDetails(data:any){
    this.SharedSpaceeDetailes.next(data);
  }
  saveAllDeviceDetails(data:any){
    this.SharedDeviceDetailes.next(data);
  }

}
