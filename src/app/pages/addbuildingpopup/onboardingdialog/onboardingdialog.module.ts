import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Routes, RouterModule } from "@angular/router";
import { AddsiteComponent } from '../../addsite/addsite.component';
import { AddLocationComponent } from 'src/app/add-location/add-location.component';
import { AddFacilityComponent } from '../../addsite/site_onboarding/add-facility/add-facility.component';
import { AddFloorComponent } from '../../addsite/site_onboarding/add-floor/add-floor.component';
import { AddSpaceComponent } from '../../addsite/site_onboarding/add-space/add-space.component';
import { AddDeviceComponent } from '../../addsite/site_onboarding/add-device/add-device.component';

// material
// import { MatSidenavModule } from "@angular/material/sidenav";
// import { MatIconModule } from "@angular/material/icon";
// import { MatListModule } from "@angular/material/list";
// import { MatTooltipModule } from "@angular/material/tooltip";
// import { MatButtonModule } from "@angular/material/button";
// import {MatTabsModule} from '@angular/material/tabs';
// import {MatInputModule} from '@angular/material/input';
// import {MatCardModule} from '@angular/material/card';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatSelectModule} from '@angular/material/select';
// import {MatAutocompleteModule} from '@angular/material/autocomplete';
// import {MatDatepickerModule} from '@angular/material/datepicker';
// import {MatRadioModule} from '@angular/material/radio';
// import {MatCheckboxModule} from '@angular/material/checkbox';
// import { MatDialogModule } from "@angular/material/dialog";
// import { MatProgressBarModule } from "@angular/material/progress-bar";
// import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AddbuildingpopupComponent } from '../addbuildingpopup.component';
import { AirquailityComponent } from '../../airquaility/airquaility.component';
import { WindowComponent } from '../../addsite/window.component';
import { FormsModule } from '@angular/forms';
import { GeoReferencingMapComponent } from '../../addsite/geo-referencing-map/geo-referencing-map.component';
import { CreateSpacesComponent } from '../../create-spaces/create-spaces.component';
import { AppMaterialModule } from './material.module';

export const ROUTES: Routes = [
  {
    path: "maptool/:id",
    component: GeoReferencingMapComponent,
  },
  {
    path: "createspaces/:id",
    component: CreateSpacesComponent,
  },
  
];

@NgModule({
  declarations: [
    AddbuildingpopupComponent,
     AddsiteComponent,
    AddLocationComponent,
    AddFacilityComponent,
    AddFloorComponent,
    AddSpaceComponent,
    AirquailityComponent,
    WindowComponent,
    CreateSpacesComponent,
    AddDeviceComponent,
    GeoReferencingMapComponent,
  ],
  imports: [
    RouterModule.forRoot(ROUTES),
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppMaterialModule
    // MatSidenavModule,
    // MatListModule,
    // MatIconModule,
    // MatProgressBarModule,
    // MatTabsModule,
    // MatCardModule,
    // MatDialogModule,
    // MatTooltipModule,
    // MatButtonModule,
    // MatInputModule,
    // MatProgressSpinnerModule,
    // MatSelectModule,
    // MatFormFieldModule,
    // MatDatepickerModule,
    // MatRadioModule,
    // MatCheckboxModule,
    // MatAutocompleteModule,
  ]
})
export class OnboardingdialogModule { }
